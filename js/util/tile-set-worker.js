import { BIT_MASK_TILE_SET_NAME } from '../data/tile-set-bit-mask.data.js';
import { Color } from './Color.js';
import { htmlImageToCanvasImage, renderTextOnCanvas } from './html-util.js';
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
export function getRenderImageFromTiles(renderSet, tileSet, borderSize, background, doRenderText, bitMaskBg = new Color(`#ebde89`), bitMaskColor = new Color(`#ba7230`), bitMaskFancyBorders = true) {
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
    const bitMaskColorOverride = new Color(`#000000`);
    const bitMaskBgOverride = new Color(`#ffffff`);
    // console.groupCollapsed(`Render Image ${renderSet.name}`);
    for (let iRow = 0; iRow < tileSet.numRows; iRow++) {
        for (let iCol = 0; iCol < tileSet.numCols; iCol++) {
            const tile = tileSet.set?.[iRow]?.[iCol];
            const tilesToRender = findTilesToRender(renderSet, tile);
            if (renderSet.name === BIT_MASK_TILE_SET_NAME)
                colorTile(bitMaskColorOverride, bitMaskColor, bitMaskBgOverride, bitMaskBg, tilesToRender?.renderTile);
            // if (renderSet.name === BIT_MASK_TILE_SET_NAME) {
            //     // TODO: return a copy instead, move to init?
            //   colorTile(c1, c1New, c2, c2New, tilesToRender?.renderTile);
            //   const tileContext = tilesToRender?.renderTile.canvas.getContext('2d');
            //   if (tileContext)
            //     // TODO: return a copy instead
            //     drawTileInsideBorder(tileContext, iCol, iRow, tileSize);
            // }
            // console.group(`Render Tile ${iRow}, ${iCol}`);
            drawImageFromTile(context, iCol, iRow, tileSizePadded, borderSize, background, tilesToRender?.renderTile);
            if (renderSet.name === BIT_MASK_TILE_SET_NAME && bitMaskFancyBorders)
                drawTileInsideBorder(context, iCol, iRow, tileSize, borderSize);
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
function replacePixelColor(imageData, pixel, cOld, cNew) {
    // is this pixel the old rgb?
    if (imageData.data[pixel] === cOld.r &&
        imageData.data[pixel + 1] === cOld.g &&
        imageData.data[pixel + 2] === cOld.b &&
        imageData.data[pixel + 3] === cOld.a255) {
        // change to your new rgb
        imageData.data[pixel] = cNew.r;
        imageData.data[pixel + 1] = cNew.g;
        imageData.data[pixel + 2] = cNew.b;
        imageData.data[pixel + 3] = cNew.a255;
    }
}
function colorTile(c1, c1New, c2, c2New, renderTile) {
    if (!renderTile)
        return;
    const context = renderTile.canvas.getContext('2d');
    if (!context) {
        console.warn('no context');
        return;
    }
    const imageData = context.getImageData(0, 0, renderTile.canvas.width, renderTile.canvas.height);
    // examine every pixel,
    // change any old rgb to the new-rgb
    for (let i = 0; i < imageData.data.length; i += 4) {
        replacePixelColor(imageData, i, c1, c1New);
        replacePixelColor(imageData, i, c2, c2New);
    }
    // put the altered data back on the canvas
    context.putImageData(imageData, 0, 0);
}
function drawTileInsideBorder(ctx, iCol, iRow, tileSize, padding) {
    const thickness = tileSize / 32;
    const x = iCol * (tileSize + padding * 2) + padding;
    const y = iRow * (tileSize + padding * 2) + padding;
    const bgAlpha = 0.1;
    const styleWhite = `rgba(245, 245, 245, ${bgAlpha})`;
    const styleBlack = `rgba(25, 25, 25, ${bgAlpha / 2})`;
    // const coordinates: Point[] = [
    //   [x + tileSize, y + thickness / 2],
    //   [x + thickness / 2 + tileSize, y + tileSize],
    //   [x + thickness / 2, y + tileSize],
    //   [x, y + thickness / 2],
    // ];
    const edges = [
        // [coordinates[0], coordinates[1], styleBlack],//
        // [coordinates[1], coordinates[2], styleBlack],//
        // [coordinates[2], coordinates[3], styleWhite],
        // [coordinates[3], coordinates[0], styleWhite],//
        [[x, y + thickness / 2], [x + tileSize, y + thickness / 2], styleWhite],
        [
            [x + tileSize - thickness / 2, y],
            [x + tileSize - thickness / 2, y + tileSize],
            styleBlack,
        ],
        [
            [x + tileSize, y + tileSize - thickness / 2],
            [x, y + tileSize - thickness / 2],
            styleBlack,
        ],
        [[x + thickness / 2, y + tileSize], [x + thickness / 2, y], styleWhite],
    ];
    ctx.lineWidth = thickness;
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
function drawImageFromTile(context, iCol, iRow, tileSizePadded, borderSize, background, renderTile) {
    const x = iCol * tileSizePadded;
    const y = iRow * tileSizePadded;
    // Render extra spacing and background only if margin size is greater than 0
    if (borderSize > 0) {
        // If using fill
        context.fillStyle = background.toString();
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
