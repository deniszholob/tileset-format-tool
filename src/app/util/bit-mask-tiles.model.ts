import { BIT_MASK_TILE_SET } from '../data/tile-set-bit-mask.data.js';
import { cutImageIntoTiles, RenderSet } from './tile-set-worker.js';

export class BitMaskTiles {
  private readonly _tiles: RenderSet;
  public get tiles(): RenderSet {
    return this._tiles;
  }

  constructor(bitMaskImageElement: HTMLImageElement) {
    this._tiles = this.generateBitMaskTiles(bitMaskImageElement);
  }

  private generateBitMaskTiles(
    bitMaskImageElement: HTMLImageElement,
  ): RenderSet {
    const bitMaskTileSize: number = Math.max(
      bitMaskImageElement.width / BIT_MASK_TILE_SET.numCols,
      bitMaskImageElement.height / BIT_MASK_TILE_SET.numRows,
    );

    return cutImageIntoTiles(
      bitMaskImageElement,
      bitMaskTileSize,
      BIT_MASK_TILE_SET,
      0,
    );
  }
}
