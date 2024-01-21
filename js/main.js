import { APP_UPDATE_DATE } from './app-update.js';
import { HtmlElements } from './html-elements.js';
import { cutImageIntoTiles, getRenderImageFromTiles, } from './tile-set-worker.js';
import { BIT_MASK_TILE_SET, TILE_SET_OPTIONS, TILE_SETS, } from './tilesets.js';
import { checkImageLoaded, Color, getImageFromFile } from './util.js';
// console.log(TILE_SETS);
// console.log(TILE_SET_OPTIONS);
// ================================================================= //
// State
console.log('// ===================== Main.ts ======================== //');
const BIT_MASK_IMAGE_SRC = 'assets/bit-mask-tiles.png';
const HTML_ELEMENTS = new HtmlElements();
let userUpload = undefined;
let imageTiles = undefined;
let bitMaskTiles = undefined;
let tileSize = 32;
let numRows = 1;
let numCols = 1;
let outerBorderSize = 0;
let borderSizeSource = 0;
let borderSizeOutput = 0;
let bgColor = '#bbbbbb'; // #ff0000 // red
let bgAlpha = 100;
let renderTileIds = false;
let inputTileSetId = 0;
let outputTileSetId = 0;
let selectedInputTileSet = TILE_SETS[inputTileSetId];
let selectedOutputTileSet = TILE_SETS[outputTileSetId];
// ================================================================= //
// Expose global functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onLoad = onLoad;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onImageUpload = onImageUpload;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onTileSizeChange = onTileSizeChange;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onNumRowsChange = onNumRowsChange;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onNumColsChange = onNumColsChange;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSourceImageBorderSize = onUpdateSourceImageBorderSize;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSourceBorderSize = onUpdateSourceBorderSize;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateOutputBorderSize = onUpdateOutputBorderSize;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateBgColor = onUpdateBgColor;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateBgAlpha = onUpdateBgAlpha;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onToggleRenderTileIds = onToggleRenderTileIds;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onProcessImage = onProcessImage;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateInputTileSet = onUpdateInputTileSet;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateOutputTileSet = onUpdateOutputTileSet;
// ================================================================= //
// Global Functions
function onLoad() {
    console.log(`App Updated last: `, APP_UPDATE_DATE);
    console.log('// ===================== onLoad() ======================== //');
    HTML_ELEMENTS.updateDate.innerHTML = APP_UPDATE_DATE;
    makeBitMaskTiles();
    populateTileSelects();
    syncStateWithHtml();
    onUpdateInputTileSet();
}
function makeBitMaskTiles() {
    // console.log('makeBitMaskTiles()');
    // const bitMaskImageElement: HTMLImageElement = document.createElement('img');
    const bitMaskImageElement = new Image();
    // document.body.append(bitMaskImageElement);
    bitMaskImageElement.src = BIT_MASK_IMAGE_SRC;
    // console.log(
    //   bitMaskImageElement,
    //   bitMaskImageElement.width,
    //   bitMaskImageElement.height,
    // );
    const bitMaskTileSize = Math.max(bitMaskImageElement.width / BIT_MASK_TILE_SET.numCols, bitMaskImageElement.height / BIT_MASK_TILE_SET.numRows);
    bitMaskTiles = cutImageIntoTiles(bitMaskImageElement, bitMaskTileSize, BIT_MASK_TILE_SET, borderSizeOutput);
    // console.log({ bitMaskImageElement, bitMaskTileSize, bitMaskTiles });
    reRenderInputImageBitMask();
    reRenderOutputImageBitMask();
}
function syncStateWithHtml() {
    HTML_ELEMENTS.tileSizeInput.valueAsNumber = tileSize;
    HTML_ELEMENTS.rowsInput.valueAsNumber = numRows;
    HTML_ELEMENTS.columnsInput.valueAsNumber = numCols;
    HTML_ELEMENTS.sourceImageBorderSizeInput.valueAsNumber = outerBorderSize;
    HTML_ELEMENTS.sourceBorderSizeInput.valueAsNumber = borderSizeSource;
    HTML_ELEMENTS.outputBorderSizeInput.valueAsNumber = borderSizeOutput;
    HTML_ELEMENTS.bgColorInput.value = bgColor;
    HTML_ELEMENTS.bgAlphaInput.valueAsNumber = bgAlpha;
    HTML_ELEMENTS.renderTileIds.checked = renderTileIds;
    HTML_ELEMENTS.inputTileSetSelect.selectedIndex = inputTileSetId;
    HTML_ELEMENTS.outputTileSetSelect.selectedIndex = outputTileSetId;
}
function populateTileSelects() {
    createHTMLSelectOptions(HTML_ELEMENTS.inputTileSetSelect, TILE_SET_OPTIONS);
    createHTMLSelectOptions(HTML_ELEMENTS.outputTileSetSelect, TILE_SET_OPTIONS);
}
function createHTMLSelectOptions(selectElement, optionsArray) {
    const fragment = document.createDocumentFragment();
    optionsArray.forEach((optionData) => {
        const option = document.createElement('option');
        option.text = optionData.name;
        option.value = `${optionData.value}`;
        fragment.appendChild(option);
    });
    selectElement.innerHTML = '';
    selectElement.appendChild(fragment);
}
async function onImageUpload() {
    const file = HTML_ELEMENTS.imageInput.files?.[0];
    // if (!file) throw new Error(`No file Uploaded`);
    // if(!file) return;
    if (!file) {
        alert('Please select an image file.');
        return;
    }
    const image = await getImageFromFile(file);
    const [fileName, fileExtension] = file.name.split('.');
    userUpload = { image, fileExtension, fileName };
    HTML_ELEMENTS.uploadImagePreview.src = userUpload.image.src;
    HTML_ELEMENTS.uploadImageDimensions.textContent = `${userUpload.image.width}x${userUpload.image.height}`;
    recalculateInputImageVars();
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
}
function onTileSizeChange() {
    console.warn('onTileSizeChange not implemented');
}
function onNumRowsChange() {
    console.warn('onNumRowsChange not implemented');
}
function onNumColsChange() {
    console.warn('onNumColsChange not implemented');
}
function onUpdateSourceImageBorderSize() {
    outerBorderSize =
        parseInt(HTML_ELEMENTS.sourceImageBorderSizeInput.value) || 0;
    recalculateInputImageVars();
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
}
function onUpdateSourceBorderSize() {
    borderSizeSource = parseInt(HTML_ELEMENTS.sourceBorderSizeInput.value) || 0;
    recalculateInputImageVars();
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
}
function onUpdateOutputBorderSize() {
    borderSizeOutput = parseInt(HTML_ELEMENTS.outputBorderSizeInput.value) || 0;
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
    reRenderInputImageBitMask();
    reRenderOutputImageBitMask();
}
function onUpdateBgColor() {
    bgColor = HTML_ELEMENTS.bgColorInput.value;
}
function onUpdateBgAlpha() {
    bgAlpha = HTML_ELEMENTS.bgAlphaInput.valueAsNumber;
}
export function onToggleRenderTileIds() {
    renderTileIds = !renderTileIds;
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
    reRenderInputImageBitMask();
    reRenderOutputImageBitMask();
}
function onProcessImage() {
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
    reRenderInputImageBitMask();
    reRenderOutputImageBitMask();
}
function onUpdateInputTileSet() {
    inputTileSetId = parseInt(HTML_ELEMENTS.inputTileSetSelect.value);
    selectedInputTileSet = TILE_SETS[inputTileSetId];
    HTML_ELEMENTS.inputTileSetLink.href = selectedInputTileSet.link ?? '';
    HTML_ELEMENTS.inputTileSetLink.innerHTML = selectedInputTileSet.link
        ? selectedInputTileSet.name
        : '';
    reRenderInputImageBitMask();
    recalculateRowsCols();
    recalculateInputImageVars();
    reRenderInputImagePreview();
    onUpdateOutputTileSet();
}
function onUpdateOutputTileSet() {
    outputTileSetId = parseInt(HTML_ELEMENTS.outputTileSetSelect.value);
    selectedOutputTileSet = TILE_SETS[outputTileSetId];
    HTML_ELEMENTS.outputTileSetLink.href = selectedOutputTileSet.link ?? '';
    HTML_ELEMENTS.outputTileSetLink.innerHTML = selectedOutputTileSet.link
        ? selectedOutputTileSet.name
        : '';
    reRenderOutputImageBitMask();
    reRenderOutputImagePreview();
}
// ================================================================= //
// Helper functions
function recalculateRowsCols() {
    numRows = selectedInputTileSet.numRows;
    numCols = selectedInputTileSet.numCols;
    HTML_ELEMENTS.rowsInput.valueAsNumber = numRows;
    HTML_ELEMENTS.columnsInput.valueAsNumber = numCols;
}
/** Recalculates tile size, rows, columns based on image and tile set selected */
function recalculateInputImageVars() {
    const image = userUpload?.image;
    if (checkImageLoaded(image)) {
        // tileSize = Math.max(image.width / numCols, image.height / numRows);
        tileSize = getTileSizeFromImage(image, outerBorderSize);
        console.log({ tileSize, outerBorderSize });
        imageTiles = cutImageIntoTiles(image, tileSize, selectedInputTileSet, borderSizeSource, outerBorderSize);
    }
    else {
        tileSize = 0;
        imageTiles = undefined;
    }
    HTML_ELEMENTS.tileSizeInput.valueAsNumber = tileSize;
}
function getTileSizeFromImage(image, imageBorderSize = 0) {
    const effectiveImageWidth = image.width - 2 * imageBorderSize;
    const effectiveImageHeight = image.height - 2 * imageBorderSize;
    return Math.max(effectiveImageWidth / numCols, effectiveImageHeight / numRows);
}
function reRenderInputImageBitMask() {
    if (bitMaskTiles) {
        const tileRender = getRenderImageFromTiles(bitMaskTiles, selectedInputTileSet, borderSizeOutput, new Color(bgColor, bgAlpha), renderTileIds);
        HTML_ELEMENTS.inputImageBitMask.src = tileRender.src;
        HTML_ELEMENTS.inputImageBitMaskLink.href = tileRender.src;
        HTML_ELEMENTS.inputImageBitMaskLink.download = getDownloadLink(selectedInputTileSet, true);
        HTML_ELEMENTS.inputImageBitMaskDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
    }
}
function reRenderOutputImageBitMask() {
    if (bitMaskTiles) {
        const tileRender = getRenderImageFromTiles(bitMaskTiles, selectedOutputTileSet, borderSizeOutput, new Color(bgColor, bgAlpha), renderTileIds);
        HTML_ELEMENTS.outputImageBitMask.src = tileRender.src;
        HTML_ELEMENTS.outputImageBitMaskLink.href = tileRender.src;
        HTML_ELEMENTS.outputImageBitMaskLink.download = getDownloadLink(selectedOutputTileSet, true);
        HTML_ELEMENTS.outputImageBitMaskDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
    }
}
function reRenderInputImagePreview() {
    if (imageTiles && userUpload) {
        const tileRender = getRenderImageFromTiles(imageTiles, selectedInputTileSet, borderSizeOutput, new Color(bgColor, bgAlpha), renderTileIds);
        HTML_ELEMENTS.inputImagePreview.src = tileRender.src;
        HTML_ELEMENTS.inputImagePreviewLink.href = tileRender.src;
        HTML_ELEMENTS.inputImagePreviewLink.download = getDownloadLink(selectedInputTileSet, false);
        HTML_ELEMENTS.inputImagePreviewDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
    }
}
function reRenderOutputImagePreview() {
    if (imageTiles && userUpload) {
        const tileRender = getRenderImageFromTiles(imageTiles, selectedOutputTileSet, borderSizeOutput, new Color(bgColor, bgAlpha), renderTileIds);
        HTML_ELEMENTS.outputImagePreview.src = tileRender.src;
        HTML_ELEMENTS.outputImagePreviewLink.href = tileRender.src;
        HTML_ELEMENTS.outputImagePreviewLink.download = getDownloadLink(selectedOutputTileSet, false);
        HTML_ELEMENTS.outputImagePreviewDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
    }
}
function getDownloadLink(tileSet, isBitMask) {
    const fileExtension = !userUpload?.fileExtension || !isBitMask ? 'png' : userUpload.fileExtension;
    const fileName = userUpload?.fileName ? `${userUpload?.fileName}_` : '';
    const bitMaskName = isBitMask ? '_BitMask' : '';
    const downloadName = `${fileName}${tileSet.name}${bitMaskName}`;
    return `${downloadName}.${fileExtension}`;
}
