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
export function cutImageIntoTiles(image, tileSizePadded, tileSet, borderSize = 0, imageBorderSize = 0) {
    const canvasImage = htmlImageToCanvasImage(image);
    const tiles = [];
    const tileSize = tileSizePadded - 2 * borderSize;
    for (let y = imageBorderSize; y < image.height - imageBorderSize; y += tileSizePadded) {
        for (let x = imageBorderSize; x < image.width - imageBorderSize; x += tileSizePadded) {
            const tileCanvas = document.createElement('canvas');
            const tileContext = tileCanvas.getContext('2d');
            if (!tileContext)
                throw new Error(`Cannot load Canvas Context`);
            tileContext.imageSmoothingEnabled = false;
            tileCanvas.width = tileSize;
            tileCanvas.height = tileSize;
            tileContext.drawImage(canvasImage, x + borderSize, y + borderSize, tileSizePadded, tileSizePadded, 0, 0, tileSizePadded, tileSizePadded);
            const tileFromTileSet = tileSet.set[Math.round(y / tileSizePadded)][Math.round(x / tileSizePadded)];
            tiles.push({ tile: tileFromTileSet, canvas: tileCanvas });
        }
    }
    return { name: tileSet.name, tileSize, set: tiles };
}
export function getRenderImageFromTiles(renderSet, tileSet, borderSize, color, doRenderText) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context)
        throw new Error(`Cannot load Canvas Context`);
    context.imageSmoothingEnabled = false;
    const tileSize = renderSet.tileSize;
    const numRows = tileSet.numRows;
    const numCols = tileSet.numCols;
    const tileSizePadded = tileSize + 2 * borderSize;
    canvas.width = numCols * tileSizePadded;
    canvas.height = numRows * tileSizePadded;
    // console.groupCollapsed(`Render Image ${renderSet.name}`);
    for (let iRow = 0; iRow < tileSet.numRows; iRow++) {
        for (let iCol = 0; iCol < tileSet.numCols; iCol++) {
            const tile = tileSet.set?.[iRow]?.[iCol];
            const tilesToRender = findTilesToRender(renderSet, tile);
            // console.group(`Render Tile ${iRow}, ${iCol}`);
            drawImageFromTile(context, iCol, iRow, tileSizePadded, borderSize, color, tilesToRender?.renderTile);
            if (doRenderText && tilesToRender?.textTile) {
                drawTextFromTile(context, iCol, iRow, tileSizePadded, tilesToRender.textTile);
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
function findTilesToRender(renderSet, tile) {
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
    return { renderTile, textTile };
}
function drawTextFromTile(context, iCol, iRow, tileSizePadded, textTile) {
    const text = textTile.toString().replace('_', '\n');
    const tileXCenter = iCol * tileSizePadded + tileSizePadded / 2;
    const tileYCenter = iRow * tileSizePadded + tileSizePadded / 2;
    const fontSize = tileSizePadded / 3.3;
    renderTextOnCanvas(context, text, tileXCenter, tileYCenter, fontSize);
}
function drawImageFromTile(context, iCol, iRow, tileSizePadded, borderSize, color, renderTile) {
    const x = iCol * tileSizePadded;
    const y = iRow * tileSizePadded;
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
    if (renderTile?.tile == null)
        return;
    context.drawImage(renderTile.canvas, x + borderSize, y + borderSize);
}
