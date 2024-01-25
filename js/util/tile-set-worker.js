import { BIT_MASK_TILE_SET_NAME } from '../data/tile-set-bit-mask.data.js';
import { htmlImageToCanvasImage, renderTextOnCanvas, } from './html-util.js';
export class RenderImage {
    src;
    width;
    height;
    constructor(canvas) {
        this.src = canvas.toDataURL('image/png');
        this.width = canvas.width;
        this.height = canvas.height;
    }
}
export function getRenderImageFromTiles(renderSet, tileSet, borderSize, color, doRenderText) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context)
        throw new Error(`Cannot load Canvas Context`);
    context.imageSmoothingEnabled = false;
    const sampleTile = renderSet.set[0];
    if (!sampleTile) {
        throw Error(`tiles array is empty or null: ${renderSet.set}`);
    }
    const tileSize = sampleTile.canvas.width;
    const numRows = tileSet.numRows;
    const numCols = tileSet.numCols;
    const tileSizePadded = tileSize + 2 * borderSize;
    canvas.width = numCols * tileSizePadded;
    canvas.height = numRows * tileSizePadded;
    tileSet.set.forEach((rowTiles, iR) => {
        rowTiles.forEach((tile, iC) => {
            const x = iC * tileSizePadded;
            const y = iR * tileSizePadded;
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
            if (!tile)
                return;
            // Try to find variant tile
            let renderTile = renderSet.set.find((t) => t.tile?.id === tile.id && t.tile.variant === tile.variant);
            // this will pull from the renderset vs tileset, for bitmasks, there is no variants
            let textTile = tile;
            // If no variant tile found, try to find base tile
            if (!renderTile) {
                renderTile = renderSet.set.find((t) => t.tile?.id === tile.id);
                if (renderTile?.tile && renderSet.name !== BIT_MASK_TILE_SET_NAME) {
                    textTile = renderTile.tile;
                }
            }
            if (renderTile?.tile == null)
                return;
            context.drawImage(renderTile.canvas, x + borderSize, y + borderSize);
            if (doRenderText) {
                const text = textTile.toString();
                const tileXCenter = iC * tileSizePadded + tileSizePadded / 2;
                const tileYCenter = iR * tileSizePadded + tileSizePadded / 2;
                const fontSize = tileSize / 3;
                renderTextOnCanvas(canvas, text, tileXCenter, tileYCenter, fontSize);
            }
        });
    });
    return new RenderImage(canvas);
}
export function cutImageIntoTiles(image, tileSizePadded, tileSet, borderSize = 0, imageBorderSize = 0) {
    const canvasImage = htmlImageToCanvasImage(image);
    const tiles = [];
    for (let y = imageBorderSize; y < image.height - imageBorderSize; y += tileSizePadded) {
        for (let x = imageBorderSize; x < image.width - imageBorderSize; x += tileSizePadded) {
            const tileCanvas = document.createElement('canvas');
            const tileContext = tileCanvas.getContext('2d');
            if (!tileContext)
                throw new Error(`Cannot load Canvas Context`);
            tileContext.imageSmoothingEnabled = false;
            const tileSize = tileSizePadded - 2 * borderSize;
            tileCanvas.width = tileSize;
            tileCanvas.height = tileSize;
            tileContext.drawImage(canvasImage, x + borderSize, y + borderSize, tileSizePadded, tileSizePadded, 0, 0, tileSizePadded, tileSizePadded);
            const tileFromTileSet = tileSet.set[Math.round(y / tileSizePadded)][Math.round(x / tileSizePadded)];
            tiles.push({ tile: tileFromTileSet, canvas: tileCanvas });
        }
    }
    return { name: tileSet.name, set: tiles };
}
