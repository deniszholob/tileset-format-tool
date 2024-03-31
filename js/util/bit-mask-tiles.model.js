import { BIT_MASK_TILE_SET } from '../data/tile-set-bit-mask.data.js';
import { cutImageIntoTiles } from './tile-set-worker.js';
export class BitMaskTiles {
    _tiles;
    get tiles() {
        return this._tiles;
    }
    constructor(bitMaskImageElement) {
        this._tiles = this.generateBitMaskTiles(bitMaskImageElement);
    }
    generateBitMaskTiles(bitMaskImageElement) {
        // const bitMaskTileSize: number = Math.max(
        //   bitMaskImageElement.width / BIT_MASK_TILE_SET.numCols,
        //   bitMaskImageElement.height / BIT_MASK_TILE_SET.numRows,
        // );
        const bitMaskTileDimensions = {
            width: bitMaskImageElement.width / BIT_MASK_TILE_SET.numCols,
            height: bitMaskImageElement.height / BIT_MASK_TILE_SET.numRows,
        };
        return cutImageIntoTiles(bitMaskImageElement, bitMaskTileDimensions, BIT_MASK_TILE_SET, 0);
    }
}
