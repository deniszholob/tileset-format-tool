import { APP_UPDATE_DATE } from './app-update.js';
import { DEFAULT_TILE_SETS } from './data/tile-set_default.data.js';
import { BIT_MASK_TILE_SET } from './data/tile-set-bit-mask.data.js';
import { HtmlElementsMainPage } from './html-elements.js';
import { generateBitMaskTiles, renderTileSet } from './tile-set-renderer.js';
import { cutImageIntoTiles, getRenderImageFromTiles, } from './tile-set-worker.js';
import { checkImageLoaded, Color, existSavedTileSets, getImageFromFile, loadTileSetsToLocalStorage, } from './util.js';
// console.log(TILE_SETS);
// console.log(TILE_SET_OPTIONS);
// ================================================================= //
// State
console.log('// ===================== Main.ts ======================== //');
const HTML_ELEMENTS = new HtmlElementsMainPage();
let TILE_SETS = DEFAULT_TILE_SETS;
let TILE_SET_OPTIONS = TILE_SETS.toSelectOptions();
let userUpload = undefined;
let imageTiles = undefined;
let bitMaskTiles = undefined;
let tileSize = 32;
let numRows = 1;
let numCols = 1;
// let outerBorderSize: number = 3;
// let borderSizeSource: number = 7;
let outerBorderSize = 0;
let borderSizeSource = 0;
let borderSizeOutput = 1;
let bgColor = '#bbbbbb'; // #ff0000 // red
let bgAlpha = 100;
let renderTileIds = true;
let inputTileSetId = 19;
let outputTileSetId = 0;
let selectedInputTileSet = getSelectedTileSet(inputTileSetId);
let selectedOutputTileSet = getSelectedTileSet(outputTileSetId);
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
    console.log('// ================= onLoad() - Main ==================== //');
    console.log(`App Updated last: `, APP_UPDATE_DATE);
    HTML_ELEMENTS.updateDate.innerHTML = APP_UPDATE_DATE;
    loadTileSets();
    makeBitMaskTiles();
    populateTileSelects();
    syncStateWithHtml();
    onUpdateInputTileSet();
    onUpdateOutputTileSet();
}
function getSelectedTileSet(idx) {
    return TILE_SETS.sets?.[idx] ?? BIT_MASK_TILE_SET;
}
function loadTileSets() {
    TILE_SETS = existSavedTileSets()
        ? loadTileSetsToLocalStorage()
        : DEFAULT_TILE_SETS;
    TILE_SET_OPTIONS = TILE_SETS.toSelectOptions();
}
function makeBitMaskTiles() {
    const bitMaskImageElement = HTML_ELEMENTS.bitMask;
    bitMaskTiles = generateBitMaskTiles(bitMaskImageElement);
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
    selectedInputTileSet = getSelectedTileSet(inputTileSetId);
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
    selectedOutputTileSet = getSelectedTileSet(outputTileSetId);
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
        // console.log({ tileSize, outerBorderSize });
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
        renderTileSet(tileRender, HTML_ELEMENTS.inputImageBitMask, HTML_ELEMENTS.inputImageBitMaskLink, HTML_ELEMENTS.inputImageBitMaskDimensions, getDownloadLink(true, selectedInputTileSet.name));
    }
}
function reRenderOutputImageBitMask() {
    if (bitMaskTiles) {
        const tileRender = getRenderImageFromTiles(bitMaskTiles, selectedOutputTileSet, borderSizeOutput, new Color(bgColor, bgAlpha), renderTileIds);
        renderTileSet(tileRender, HTML_ELEMENTS.outputImageBitMask, HTML_ELEMENTS.outputImageBitMaskLink, HTML_ELEMENTS.outputImageBitMaskDimensions, getDownloadLink(true, selectedOutputTileSet.name));
    }
}
function reRenderInputImagePreview() {
    if (imageTiles && userUpload) {
        const tileRender = getRenderImageFromTiles(imageTiles, selectedInputTileSet, borderSizeOutput, new Color(bgColor, bgAlpha), renderTileIds);
        renderTileSet(tileRender, HTML_ELEMENTS.inputImagePreview, HTML_ELEMENTS.inputImagePreviewLink, HTML_ELEMENTS.inputImagePreviewDimensions, getDownloadLink(false, selectedInputTileSet.name, selectedInputTileSet.name));
    }
}
function reRenderOutputImagePreview() {
    if (imageTiles && userUpload) {
        const tileRender = getRenderImageFromTiles(imageTiles, selectedOutputTileSet, borderSizeOutput, new Color(bgColor, bgAlpha), renderTileIds);
        renderTileSet(tileRender, HTML_ELEMENTS.outputImagePreview, HTML_ELEMENTS.outputImagePreviewLink, HTML_ELEMENTS.outputImagePreviewDimensions, getDownloadLink(false, selectedOutputTileSet.name, selectedOutputTileSet.name));
    }
}
function getDownloadLink(isBitMask, tileSetName, inputTileSetName) {
    const fileExtension = !userUpload?.fileExtension || !isBitMask ? 'png' : userUpload.fileExtension;
    const fileName = userUpload?.fileName ? `${userUpload?.fileName}_` : '';
    const bitMaskName = isBitMask ? '_BitMask' : '';
    const downloadName = `${fileName.replace(inputTileSetName ?? '', '')}${tileSetName}${bitMaskName}`;
    return `${downloadName}.${fileExtension}`;
}
