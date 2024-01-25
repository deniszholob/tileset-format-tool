import { Tile } from '../classes/Tile.model.js';
import { TileSet } from '../classes/TileSet.model.js';
import { BIT_MASK_TILE_SET_NAME } from '../data/tile-set-bit-mask.data.js';
import {
  Color,
  htmlImageToCanvasImage,
  renderTextOnCanvas,
} from './html-util.js';

export interface RenderSet {
  name: string;
  tileSize: number;
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

export function cutImageIntoTiles(
  image: HTMLImageElement,
  tileSizePadded: number,
  tileSet: TileSet,
  borderSize: number = 0,
  imageBorderSize: number = 0,
): RenderSet {
  const canvasImage: HTMLCanvasElement = htmlImageToCanvasImage(image);
  const tiles: RenderTile[] = [];
  const tileSize: number = tileSizePadded - 2 * borderSize;

  for (
    let y: number = imageBorderSize;
    y < image.height - imageBorderSize;
    y += tileSizePadded
  ) {
    for (
      let x: number = imageBorderSize;
      x < image.width - imageBorderSize;
      x += tileSizePadded
    ) {
      const tileCanvas: HTMLCanvasElement = document.createElement('canvas');
      const tileContext: CanvasRenderingContext2D | null =
        tileCanvas.getContext('2d');
      if (!tileContext) throw new Error(`Cannot load Canvas Context`);
      tileContext.imageSmoothingEnabled = false;

      tileCanvas.width = tileSize;
      tileCanvas.height = tileSize;

      tileContext.drawImage(
        canvasImage,
        x + borderSize,
        y + borderSize,
        tileSizePadded,
        tileSizePadded,
        0,
        0,
        tileSizePadded,
        tileSizePadded,
      );

      const tileFromTileSet: Tile | undefined =
        tileSet.set[Math.round(y / tileSizePadded)][
          Math.round(x / tileSizePadded)
        ];

      tiles.push({ tile: tileFromTileSet, canvas: tileCanvas });
    }
  }

  return { name: tileSet.name, tileSize, set: tiles };
}

export function getRenderImageFromTiles(
  renderSet: RenderSet,
  tileSet: TileSet,
  borderSize: number,
  color: Color,
  doRenderText: boolean,
): RenderImage {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!context) throw new Error(`Cannot load Canvas Context`);
  context.imageSmoothingEnabled = false;

  const tileSize: number = renderSet.tileSize;
  const numRows: number = tileSet.numRows;
  const numCols: number = tileSet.numCols;

  const tileSizePadded: number = tileSize + 2 * borderSize;

  canvas.width = numCols * tileSizePadded;
  canvas.height = numRows * tileSizePadded;

  // console.groupCollapsed(`Render Image ${renderSet.name}`);
  for (let iRow: number = 0; iRow < tileSet.numRows; iRow++) {
    for (let iCol: number = 0; iCol < tileSet.numCols; iCol++) {
      const tile: Tile | undefined = tileSet.set?.[iRow]?.[iCol];

      const tilesToRender = findTilesToRender(renderSet, tile);

      // console.group(`Render Tile ${iRow}, ${iCol}`);
      drawImageFromTile(
        context,
        iCol,
        iRow,
        tileSizePadded,
        borderSize,
        color,
        tilesToRender?.renderTile,
      );

      if (doRenderText && tilesToRender?.textTile) {
        drawTextFromTile(
          context,
          iCol,
          iRow,
          tileSizePadded,
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
  tileSizePadded: number,
  textTile: Tile,
): void {
  const text: string = textTile.toString().replace('_', '\n');
  const tileXCenter: number = iCol * tileSizePadded + tileSizePadded / 2;
  const tileYCenter: number = iRow * tileSizePadded + tileSizePadded / 2;
  const fontSize: number = tileSizePadded / 3.3;
  renderTextOnCanvas(context, text, tileXCenter, tileYCenter, fontSize);
}

function drawImageFromTile(
  context: CanvasRenderingContext2D,
  iCol: number,
  iRow: number,
  tileSizePadded: number,
  borderSize: number,
  color: Color,
  renderTile: RenderTile | undefined,
): void {
  const x: number = iCol * tileSizePadded;
  const y: number = iRow * tileSizePadded;

  // Render extra spacing and background only if margin size is greater than 0
  if (borderSize > 0) {
    // If using fill
    context.fillStyle = color.toString();
    context.fillRect(x, y, tileSizePadded, tileSizePadded);

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
