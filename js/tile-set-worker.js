import { htmlImageToCanvasImage, renderTextOnCanvas } from './util.js';
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
export function getRenderImageFromTiles(tiles, tileSet, borderSize, color, text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context)
        throw new Error(`Cannot load Canvas Context`);
    context.imageSmoothingEnabled = false;
    const sampleTile = tiles[0];
    if (!sampleTile) {
        throw Error(`tiles array is empty or null: ${tiles}`);
    }
    const tileSize = sampleTile.canvas.width;
    const numRows = tileSet.numRows;
    const numCols = tileSet.numCols;
    const tileSizePadded = tileSize + 2 * borderSize;
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
    tileSet.set.forEach((rowTileIds, iR) => {
        rowTileIds.forEach((colTileId, iC) => {
            const tileObj = colTileId != null
                ? tiles.find((t) => t.id === colTileId)
                : undefined;
            const x = iC * tileSizePadded;
            const y = iR * tileSizePadded;
            // Render extra spacing and background only if margin size is greater than 0
            if (borderSize > 0) {
                context.fillStyle = color.toString();
                context.fillRect(x, y, tileSizePadded, tileSizePadded);
            }
            if (tileObj && tileObj.id != null) {
                context.drawImage(tileObj.canvas, x + borderSize, y + borderSize);
                if (text) {
                    const text = tileObj.id.toString();
                    const tileXCenter = iC * tileSizePadded + tileSizePadded / 2;
                    const tileYCenter = iR * tileSizePadded + tileSizePadded / 2;
                    const fontSize = tileSize / 3;
                    renderTextOnCanvas(canvas, text, tileXCenter, tileYCenter, fontSize);
                }
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
            const tileIdFromTileSet = tileSet.set[Math.round(y / tileSizePadded)][Math.round(x / tileSizePadded)];
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
