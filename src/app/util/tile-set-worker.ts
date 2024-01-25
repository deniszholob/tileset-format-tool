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

  const sampleTile: RenderTile | undefined = renderSet.set[0];
  if (!sampleTile) {
    throw Error(`tiles array is empty or null: ${renderSet.set}`);
  }
  const tileSize: number = sampleTile.canvas.width;
  const numRows: number = tileSet.numRows;
  const numCols: number = tileSet.numCols;

  const tileSizePadded: number = tileSize + 2 * borderSize;

  canvas.width = numCols * tileSizePadded;
  canvas.height = numRows * tileSizePadded;

  tileSet.set.forEach((rowTiles: (Tile | undefined)[], iR: number) => {
    rowTiles.forEach((tile: Tile | undefined, iC: number) => {
      const x: number = iC * tileSizePadded;
      const y: number = iR * tileSizePadded;

      // Render extra spacing and background only if margin size is greater than 0
      if (borderSize > 0) {
        // If using fill
        context.fillStyle = color.toString();
        context.fillRect(x, y, tileSizePadded, tileSizePadded);

        // // If using stroke
        // context.strokeStyle = color.toString();
        // context.lineWidth = borderSize;
        // // NOTE: Stroke operates on half pixels: https://stackoverflow.com/a/13879402
        // context.strokeRect(
        //   x + borderSize / 2,
        //   y + borderSize / 2,
        //   tileSizePadded - borderSize,
        //   tileSizePadded - borderSize,
        // );
      }

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

      context.drawImage(
        renderTile.canvas,
        x + borderSize,
        y + borderSize,
        // tileSize,
        // tileSize,
      );
      if (doRenderText) {
        const text: string = textTile.toString();
        const tileXCenter: number = iC * tileSizePadded + tileSizePadded / 2;
        const tileYCenter: number = iR * tileSizePadded + tileSizePadded / 2;
        const fontSize: number = tileSize / 3;
        renderTextOnCanvas(canvas, text, tileXCenter, tileYCenter, fontSize);
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
): RenderSet {
  const canvasImage: HTMLCanvasElement = htmlImageToCanvasImage(image);
  const tiles: RenderTile[] = [];

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

      const tileFromTileSet: Tile | undefined =
        tileSet.set[Math.round(y / tileSizePadded)][
          Math.round(x / tileSizePadded)
        ];

      tiles.push({ tile: tileFromTileSet, canvas: tileCanvas });
    }
  }

  return { name: tileSet.name, set: tiles };
}
