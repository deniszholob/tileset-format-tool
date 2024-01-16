import { APP_UPDATE_DATE } from './app-update.js';
import { HtmlElements } from './html-elements.js';
import { cutImageIntoTiles, getRenderImageFromTiles, } from './tile-set-worker.js';
import { TILE_SET_OPTIONS, TILE_SETS, } from './tilesets.js';
import { checkImageLoaded, Color, getImageFromFile } from './util.js';
// console.log(TILE_SETS);
// console.log(TILE_SET_OPTIONS);
// ================================================================= //
// State
console.log('// ===================== Main.ts ======================== //');
const HTML_ELEMENTS = new HtmlElements();
let inputImage = undefined;
let imageTiles = undefined;
let tileSize = 32;
let numRows = 1;
let numCols = 1;
let paddingSource = 0;
let paddingOutput = 0;
let bgColor = '#bbbbbb'; // #ff0000 // red
let bgAlpha = 100;
let renderTileIds = false;
let inputTileSetId = 0;
let outputTileSetId = 1;
let selectedInputTileSet = TILE_SETS[inputTileSetId];
let selectedOutputTileSet = TILE_SETS[outputTileSetId];
// ================================================================= //
// Expose global functions
window.onLoad = onLoad;
window.onImageUpload = onImageUpload;
window.onTileSizeChange = onTileSizeChange;
window.onNumRowsChange = onNumRowsChange;
window.onNumColsChange = onNumColsChange;
window.onUpdateSourcePadding = onUpdateSourcePadding;
window.onUpdateOutputPadding = onUpdateOutputPadding;
window.onUpdateBgColor = onUpdateBgColor;
window.onUpdateBgAlpha = onUpdateBgAlpha;
window.onToggleRenderTileIds = onToggleRenderTileIds;
window.onProcessImage = onProcessImage;
window.onUpdateInputTileSet = onUpdateInputTileSet;
window.onUpdateOutputTileSet = onUpdateOutputTileSet;
// ================================================================= //
// Global Functions
function onLoad() {
    console.log(`App Updated last: `, APP_UPDATE_DATE);
    console.log('// ===================== onLoad() ======================== //');
    populateTileSelects();
    syncStateWithHtml();
    onUpdateInputTileSet();
}
function syncStateWithHtml() {
    HTML_ELEMENTS.tileSizeInput.valueAsNumber = tileSize;
    HTML_ELEMENTS.rowsInput.valueAsNumber = numRows;
    HTML_ELEMENTS.columnsInput.valueAsNumber = numCols;
    HTML_ELEMENTS.sourcePaddingInput.valueAsNumber = paddingSource;
    HTML_ELEMENTS.outputPaddingInput.valueAsNumber = paddingOutput;
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
    inputImage = await getImageFromFile(file);
    HTML_ELEMENTS.uploadImagePreview.src = inputImage.src;
    HTML_ELEMENTS.uploadImageDimensions.textContent = `${inputImage.width}x${inputImage.height}`;
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
function onUpdateSourcePadding() {
    paddingSource = parseInt(HTML_ELEMENTS.sourcePaddingInput.value) || 0;
    recalculateInputImageVars();
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
}
function onUpdateOutputPadding() {
    paddingOutput = parseInt(HTML_ELEMENTS.outputPaddingInput.value) || 0;
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
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
}
function onProcessImage() {
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
}
function onUpdateInputTileSet() {
    inputTileSetId = parseInt(HTML_ELEMENTS.inputTileSetSelect.value);
    selectedInputTileSet = TILE_SETS[inputTileSetId];
    recalculateRowsCols();
    recalculateInputImageVars();
    reRenderInputImagePreview();
    reRenderOutputImagePreview();
}
function onUpdateOutputTileSet() {
    outputTileSetId = parseInt(HTML_ELEMENTS.outputTileSetSelect.value);
    selectedOutputTileSet = TILE_SETS[outputTileSetId];
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
    const image = inputImage;
    if (checkImageLoaded(image)) {
        tileSize = Math.max(image.width / numCols, image.height / numRows);
        imageTiles = cutImageIntoTiles(image, tileSize, selectedInputTileSet, paddingSource);
    }
    else {
        tileSize = 0;
        imageTiles = undefined;
    }
    HTML_ELEMENTS.tileSizeInput.valueAsNumber = tileSize;
}
function reRenderInputImagePreview() {
    if (imageTiles) {
        const inputImageTileRender = getRenderImageFromTiles(imageTiles, selectedInputTileSet, paddingOutput, new Color(bgColor, bgAlpha), renderTileIds);
        HTML_ELEMENTS.inputImagePreview.src = inputImageTileRender.src;
        HTML_ELEMENTS.inputImagePreviewLink.href = inputImageTileRender.src;
        HTML_ELEMENTS.inputImagePreviewDimensions.textContent = `${inputImageTileRender.width}x${inputImageTileRender.height}`;
    }
}
function reRenderOutputImagePreview() {
    if (imageTiles) {
        const outputImageTileRender = getRenderImageFromTiles(imageTiles, selectedOutputTileSet, paddingOutput, new Color(bgColor, bgAlpha), renderTileIds);
        HTML_ELEMENTS.outputImagePreview.src = outputImageTileRender.src;
        HTML_ELEMENTS.outputImagePreviewLink.href = outputImageTileRender.src;
        HTML_ELEMENTS.outputImagePreviewDimensions.textContent = `${outputImageTileRender.width}x${outputImageTileRender.height}`;
    }
}
