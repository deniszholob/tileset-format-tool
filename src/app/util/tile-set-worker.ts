import { Dimensions } from '../classes/Dimensions.js';
import { Tile } from '../classes/Tile.model.js';
import { TileSet } from '../classes/TileSet.model.js';
import { BIT_MASK_TILE_SET_NAME } from '../data/tile-set-bit-mask.data.js';
import { Color } from './Color.js';
import { htmlImageToCanvasImage, renderTextOnCanvas } from './html-util.js';

export interface RenderSet {
  name: string;
  tileDimensionsWithNoBorder: Dimensions;
  set: RenderTile[];
}

export interface RenderTile {
  tile: Tile | undefined;
  canvas: HTMLCanvasElement;
}

export class RenderImage {
  src: string;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.src = canvas.toDataURL('image/png');
    this.width = canvas.width;
    this.height = canvas.height;
  }
}

/** Needs to have tile set selected and numCols/numRows recalculated beforehand */
export function getTileDimensionsFromImage(
  image: HTMLImageElement,
  numRows: number,
  numCols: number,
  imageBorderSize: number = 0,
): Dimensions {
  const effectiveImageWidth: number = image.width - 2 * imageBorderSize;
  const effectiveImageHeight: number = image.height - 2 * imageBorderSize;
  const dim: Dimensions = {
    width: effectiveImageWidth / numCols,
    height: effectiveImageHeight / numRows,
  };
  return dim;
}

export function getTileDimensionsWithNoBorder(
  tileDimensionsWithBorder: Dimensions,
  tileBorderSize: number,
): Dimensions {
  return {
    width: tileDimensionsWithBorder.width - 2 * tileBorderSize,
    height: tileDimensionsWithBorder.height - 2 * tileBorderSize,
  };
}

function getTileDimensionsWithBorder(
  tileDimensionsWithNoBorder: Dimensions,
  tileBorderSize: number,
): Dimensions {
  return {
    width: tileDimensionsWithNoBorder.width + 2 * tileBorderSize,
    height: tileDimensionsWithNoBorder.height + 2 * tileBorderSize,
  };
}

export function cutImageIntoTiles(
  image: HTMLImageElement,
  tileDimensionsWithBorder: Dimensions,
  tileSet: TileSet,
  tileBorderSize: number = 0,
  imageBorderSize: number = 0,
): RenderSet {
  const canvasImage: HTMLCanvasElement = htmlImageToCanvasImage(image);
  const tiles: RenderTile[] = [];
  const tileDimensionsWithNoBorder: Dimensions = getTileDimensionsWithNoBorder(
    tileDimensionsWithBorder,
    tileBorderSize,
  );

  for (
    let y: number = imageBorderSize;
    y < image.height - imageBorderSize;
    y += tileDimensionsWithBorder.height
  ) {
    for (
      let x: number = imageBorderSize;
      x < image.width - imageBorderSize;
      x += tileDimensionsWithBorder.width
    ) {
      const tileCanvas: HTMLCanvasElement = document.createElement('canvas');
      const tileContext: CanvasRenderingContext2D | null =
        tileCanvas.getContext('2d');
      if (!tileContext) throw new Error(`Cannot load Canvas Context`);
      tileContext.imageSmoothingEnabled = false;

      tileCanvas.width = tileDimensionsWithNoBorder.width;
      tileCanvas.height = tileDimensionsWithNoBorder.height;

      tileContext.drawImage(
        canvasImage,
        x + tileBorderSize,
        y + tileBorderSize,
        tileDimensionsWithBorder.width,
        tileDimensionsWithBorder.height,
        0,
        0,
        tileDimensionsWithBorder.width,
        tileDimensionsWithBorder.height,
      );

      const tileFromTileSet: Tile | undefined =
        tileSet.set[Math.round(y / tileDimensionsWithBorder.height)][
          Math.round(x / tileDimensionsWithBorder.width)
        ];

      tiles.push({ tile: tileFromTileSet, canvas: tileCanvas });
    }
  }

  return { name: tileSet.name, tileDimensionsWithNoBorder, set: tiles };
}

export function getRenderImageFromTiles(
  renderSet: RenderSet,
  tileSet: TileSet,
  borderSize: number,
  background: Color,
  doRenderText: boolean,
  bitMaskBg: Color = new Color(`#ebde89`),
  bitMaskColor: Color = new Color(`#ba7230`),
  bitMaskFancyBorders: boolean = true,
): RenderImage {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!context) throw new Error(`Cannot load Canvas Context`);
  context.imageSmoothingEnabled = false;

  const tileDimensionsWithNoBorder: Dimensions =
    renderSet.tileDimensionsWithNoBorder;
  const numRows: number = tileSet.numRows;
  const numCols: number = tileSet.numCols;

  const tileDimensionsWithBorder: Dimensions = getTileDimensionsWithBorder(
    tileDimensionsWithNoBorder,
    borderSize,
  );

  canvas.width = numCols * tileDimensionsWithBorder.width;
  canvas.height = numRows * tileDimensionsWithBorder.height;

  const bitMaskColorOverride: Color = new Color(`#000000`);
  const bitMaskBgOverride: Color = new Color(`#ffffff`);

  // console.groupCollapsed(`Render Image ${renderSet.name}`);
  for (let iRow: number = 0; iRow < tileSet.numRows; iRow++) {
    for (let iCol: number = 0; iCol < tileSet.numCols; iCol++) {
      const tile: Tile | undefined = tileSet.set?.[iRow]?.[iCol];

      const tilesToRender = findTilesToRender(renderSet, tile);

      if (renderSet.name === BIT_MASK_TILE_SET_NAME)
        colorTile(
          bitMaskColorOverride,
          bitMaskColor,
          bitMaskBgOverride,
          bitMaskBg,
          tilesToRender?.renderTile,
        );

      // if (renderSet.name === BIT_MASK_TILE_SET_NAME) {
      //     // TODO: return a copy instead, move to init?
      //   colorTile(c1, c1New, c2, c2New, tilesToRender?.renderTile);
      //   const tileContext = tilesToRender?.renderTile.canvas.getContext('2d');
      //   if (tileContext)
      //     // TODO: return a copy instead
      //     drawTileInsideBorder(tileContext, iCol, iRow, tileSize);
      // }

      // console.group(`Render Tile ${iRow}, ${iCol}`);
      drawImageFromTile(
        context,
        iCol,
        iRow,
        tileDimensionsWithBorder,
        borderSize,
        background,
        tilesToRender?.renderTile,
      );

      if (renderSet.name === BIT_MASK_TILE_SET_NAME && bitMaskFancyBorders)
        drawTileInsideBorder(
          context,
          iCol,
          iRow,
          tileDimensionsWithNoBorder,
          borderSize,
        );

      if (doRenderText && tilesToRender?.textTile) {
        drawTextFromTile(
          context,
          iCol,
          iRow,
          tileDimensionsWithBorder,
          tilesToRender.textTile,
        );
      }
      // console.groupEnd();
    }
  }
  // console.groupEnd();

  // tileSet.set.forEach((rowTiles: (Tile | undefined)[], iR: number) => {
  //   rowTiles.forEach((tile: Tile | undefined, iC: number) => {

  //   });
  // });

  return new RenderImage(canvas);
}

function replacePixelColor(
  imageData: ImageData,
  pixel: number,
  cOld: Color,
  cNew: Color,
): void {
  // is this pixel the old rgb?
  if (
    imageData.data[pixel] === cOld.r &&
    imageData.data[pixel + 1] === cOld.g &&
    imageData.data[pixel + 2] === cOld.b &&
    imageData.data[pixel + 3] === cOld.a255
  ) {
    // change to your new rgb
    imageData.data[pixel] = cNew.r;
    imageData.data[pixel + 1] = cNew.g;
    imageData.data[pixel + 2] = cNew.b;
    imageData.data[pixel + 3] = cNew.a255;
  }
}

function colorTile(
  c1: Color,
  c1New: Color,
  c2: Color,
  c2New: Color,
  renderTile?: RenderTile,
): void {
  if (!renderTile) return;
  const context: CanvasRenderingContext2D | null = renderTile.canvas.getContext(
    '2d',
    // { willReadFrequently: true },
  );
  if (!context) {
    console.warn('no context');
    return;
  }

  const imageData: ImageData = context.getImageData(
    0,
    0,
    renderTile.canvas.width,
    renderTile.canvas.height,
  );

  // examine every pixel,
  // change any old rgb to the new-rgb
  for (let i = 0; i < imageData.data.length; i += 4) {
    replacePixelColor(imageData, i, c1, c1New);
    replacePixelColor(imageData, i, c2, c2New);
  }
  // put the altered data back on the canvas
  context.putImageData(imageData, 0, 0);
}

type Point = [number, number];
type Edge = [Point, Point, string];

function drawTileInsideBorder(
  ctx: CanvasRenderingContext2D,
  iCol: number,
  iRow: number,
  tileDimensionsWithNoBorder: Dimensions,
  padding: number,
): void {
  const strokeThickness: number = tileDimensionsWithNoBorder.width / 32;
  const strokeRadius: number = strokeThickness / 2;
  const x: number =
    iCol * (tileDimensionsWithNoBorder.width + padding * 2) + padding;
  const y: number =
    iRow * (tileDimensionsWithNoBorder.width + padding * 2) + padding;

  const bgAlpha = 0.1;
  const styleWhite = `rgba(245, 245, 245, ${bgAlpha})`;
  const styleBlack = `rgba(25, 25, 25, ${bgAlpha / 2})`;

  // const coordinates: Point[] = [
  //   [x + tileSize, y + thickness / 2],
  //   [x + thickness / 2 + tileSize, y + tileSize],
  //   [x + thickness / 2, y + tileSize],
  //   [x, y + thickness / 2],
  // ];
  const edges: Edge[] = [
    // [coordinates[0], coordinates[1], styleBlack],//
    // [coordinates[1], coordinates[2], styleBlack],//
    // [coordinates[2], coordinates[3], styleWhite],
    // [coordinates[3], coordinates[0], styleWhite],//

    [
      // Top - left=>right
      [x, y + strokeRadius],
      [x + tileDimensionsWithNoBorder.width, y + strokeRadius],
      styleWhite,
    ],
    [
      // Right - top=>bottom
      [x + tileDimensionsWithNoBorder.width - strokeRadius, y],
      [
        x + tileDimensionsWithNoBorder.width - strokeRadius,
        y + tileDimensionsWithNoBorder.height,
      ],
      styleBlack,
    ],
    [
      // Bottom - right=>left
      [
        x + tileDimensionsWithNoBorder.width,
        y + tileDimensionsWithNoBorder.height - strokeRadius,
      ],
      [x, y + tileDimensionsWithNoBorder.height - strokeRadius],
      styleBlack,
    ],
    [
      // Left - bottom=>top
      [x + strokeRadius, y + tileDimensionsWithNoBorder.height],
      [x + strokeRadius, y],
      styleWhite,
    ],
  ];

  ctx.lineWidth = strokeThickness;
  edges.forEach((edge) => {
    const style = edge[2];
    const x1 = edge[0][0];
    const y1 = edge[0][1];
    const x2 = edge[1][0];
    const y2 = edge[1][1];

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    // ctx.moveTo(edge[0][0], edge[0][1]);
    // ctx.lineTo(edge[1][0], edge[1][1]);
    ctx.closePath();
    ctx.strokeStyle = style;

    ctx.stroke();
  });

  // ctx.moveTo(x, y);
  // ctx.lineTo(x + tileSize, y);
  // ctx.lineTo(x + tileSize, y + tileSize);
  // ctx.lineTo(x, y + tileSize);
  // ctx.lineTo(x, y);
  // ctx.stroke();
}

function findTilesToRender(renderSet: RenderSet, tile: Tile | undefined) {
  if (!tile) return;

  // Try to find variant tile
  let renderTile: RenderTile | undefined = renderSet.set.find(
    (t: RenderTile): boolean =>
      t.tile?.id === tile.id && t.tile.variant === tile.variant,
  );

  // this will pull from the renderset vs tileset, for bitmasks, there is no variants
  let textTile: Tile = tile;

  // If no variant tile found, try to find base tile
  if (!renderTile) {
    renderTile = renderSet.set.find(
      (t: RenderTile): boolean => t.tile?.id === tile.id,
    );
    if (renderTile?.tile && renderSet.name !== BIT_MASK_TILE_SET_NAME) {
      textTile = renderTile.tile;
    }
  }

  if (renderTile?.tile == null) return;

  return { renderTile, textTile };
}

function drawTextFromTile(
  context: CanvasRenderingContext2D,
  iCol: number,
  iRow: number,
  tileDimensionsWithBorder: Dimensions,
  textTile: Tile,
): void {
  const text: string = textTile.toString().replace('_', '\n');
  const tileXCenter: number =
    iCol * tileDimensionsWithBorder.width + tileDimensionsWithBorder.width / 2;
  const tileYCenter: number =
    iRow * tileDimensionsWithBorder.height +
    tileDimensionsWithBorder.height / 2;
  const fontSize: number = tileDimensionsWithBorder.width / 3.3;
  renderTextOnCanvas(context, text, tileXCenter, tileYCenter, fontSize);
}

function drawImageFromTile(
  context: CanvasRenderingContext2D,
  iCol: number,
  iRow: number,
  tileDimensionsWithBorder: Dimensions,
  borderSize: number,
  background: Color,
  renderTile: RenderTile | undefined,
): void {
  const x: number = iCol * tileDimensionsWithBorder.width;
  const y: number = iRow * tileDimensionsWithBorder.height;

  // Render extra spacing and background only if margin size is greater than 0
  if (borderSize > 0) {
    // If using fill
    context.fillStyle = background.toString();
    context.fillRect(
      x,
      y,
      tileDimensionsWithBorder.width,
      tileDimensionsWithBorder.height,
    );

    // // If using stroke
    // context.strokeStyle = color.toString();
    // context.lineWidth = borderSize;
    // // NOTE: Stroke operates on half pixels: https://stackoverflow.com/a/13879402
    // console.log(
    //   `stroke`,
    //   x + borderSize / 2,
    //   y + borderSize / 2,
    //   tileSizePadded - borderSize,
    //   tileSizePadded - borderSize,
    // );
    // context.strokeRect(
    //   x + borderSize / 2,
    //   y + borderSize / 2,
    //   tileSizePadded - borderSize,
    //   tileSizePadded - borderSize,
    // );
  }

  if (renderTile?.tile == null) return;

  context.drawImage(
    renderTile.canvas,
    x + borderSize,
    y + borderSize,
    // tileSize,
    // tileSize,
  );
}
