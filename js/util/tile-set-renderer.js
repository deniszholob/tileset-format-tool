import { BIT_MASK_TILE_SET } from '../data/tile-set-bit-mask.data.js';
import { cutImageIntoTiles, } from './tile-set-worker.js';
export function generateBitMaskTiles(bitMaskImageElement) {
    const bitMaskTileSize = Math.max(bitMaskImageElement.width / BIT_MASK_TILE_SET.numCols, bitMaskImageElement.height / BIT_MASK_TILE_SET.numRows);
    return cutImageIntoTiles(bitMaskImageElement, bitMaskTileSize, BIT_MASK_TILE_SET, 0);
}
export function renderTileSet(
/** Data to render */
renderImage, 
/** Image Element to render to */
outputImageElement, 
/** Anchor element to use as click to download */
outputImageLinkElement, 
/** Span Element to display dimension data */
outputImageDimensionsElement, 
/** What should the downloadable file be saved as  */
downloadName) {
    outputImageElement.src = renderImage.src;
    outputImageLinkElement.href = renderImage.src;
    outputImageLinkElement.download = downloadName;
    outputImageDimensionsElement.textContent = `${renderImage.width}x${renderImage.height}`;
}
