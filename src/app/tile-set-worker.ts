import { TileSet } from './classes/TileSet.model.js';
import { Color, htmlImageToCanvasImage, renderTextOnCanvas } from './util.js';

export interface Tile {
  id: number | null;
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

export function getRenderImageFromTiles(
  tiles: Tile[],
  tileSet: TileSet,
  borderSize: number,
  color: Color,
  text: boolean,
): RenderImage {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!context) throw new Error(`Cannot load Canvas Context`);
  context.imageSmoothingEnabled = false;

  const sampleTile: Tile | undefined = tiles[0];
  if (!sampleTile) {
    throw Error(`tiles array is empty or null: ${tiles}`);
  }
  const tileSize: number = sampleTile.canvas.width;
  const numRows: number = tileSet.numRows;
  const numCols: number = tileSet.numCols;

  const tileSizePadded: number = tileSize + 2 * borderSize;

  canvas.width = numCols * tileSizePadded;
  canvas.height = numRows * tileSizePadded;
  // console.log(
  //   tiles,
  //   sampleTile,
  //   numRows,
  //   numCols,
  //   tileSize,
  //   tileSizePadded,
  //   canvas.width,
  //   canvas.height,
  // );

  tileSet.set.forEach((rowTileIds: (number | null)[], iR: number) => {
    rowTileIds.forEach((colTileId: number | null, iC: number) => {
      const tileObj: Tile | undefined =
        colTileId != null
          ? tiles.find((t: Tile): boolean => t.id === colTileId)
          : undefined;

      const x: number = iC * tileSizePadded;
      const y: number = iR * tileSizePadded;

      // Render extra spacing and background only if margin size is greater than 0
      if (borderSize > 0) {
        context.fillStyle = color.toString();
        context.fillRect(x, y, tileSizePadded, tileSizePadded);
      }

      if (tileObj && tileObj.id != null) {
        context.drawImage(
          tileObj.canvas,
          x + borderSize,
          y + borderSize,
          // tileSize,
          // tileSize,
        );
        if (text) {
          const text: string = tileObj.id.toString();
          const tileXCenter: number = iC * tileSizePadded + tileSizePadded / 2;
          const tileYCenter: number = iR * tileSizePadded + tileSizePadded / 2;
          const fontSize: number = tileSize / 3;
          renderTextOnCanvas(canvas, text, tileXCenter, tileYCenter, fontSize);
        }
      }
    });
  });

  return new RenderImage(canvas);
}

export function cutImageIntoTiles(
  image: HTMLImageElement,
  tileSizePadded: number,
  tileSet: TileSet,
  borderSize: number = 0,
  imageBorderSize: number = 0,
): Tile[] {
  const canvasImage: HTMLCanvasElement = htmlImageToCanvasImage(image);
  const tiles: Tile[] = [];

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

      const tileSize: number = tileSizePadded - 2 * borderSize;

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

      const tileIdFromTileSet: number | null =
        tileSet.set[Math.round(y / tileSizePadded)][
          Math.round(x / tileSizePadded)
        ];

      // console.log(
      //   tileSizePadded,
      //   tileSize,
      //   y,
      //   x,
      //   Math.round(y / tileSizePadded),
      //   Math.round(x / tileSizePadded),
      //   tileIdFromTileSet,
      // );

      tiles.push({ id: tileIdFromTileSet, canvas: tileCanvas });
    }
  }

  return tiles;
}
