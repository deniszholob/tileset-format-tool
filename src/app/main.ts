import { APP_UPDATE_DATE } from './app-update.js';
import { HtmlElements } from './html-elements.js';
import {
  cutImageIntoTiles,
  getRenderImageFromTiles,
  RenderImage,
  Tile,
} from './tile-set-worker.js';
import {
  BIT_MASK_TILE_SET,
  SelectOption,
  TILE_SET_OPTIONS,
  TILE_SETS,
  TileSet,
} from './tilesets.js';
import { checkImageLoaded, Color, getImageFromFile } from './util.js';

// console.log(TILE_SETS);
// console.log(TILE_SET_OPTIONS);

// ================================================================= //
// State

console.log('// ===================== Main.ts ======================== //');
const BIT_MASK_IMAGE_SRC = 'assets/bit-mask-tiles.png';
const HTML_ELEMENTS = new HtmlElements();

let inputImage: HTMLImageElement | undefined = undefined;
let imageTiles: Tile[] | undefined = undefined;
let bitMaskTiles: Tile[] | undefined = undefined;

let tileSize: number = 32;
let numRows: number = 1;
let numCols: number = 1;

let paddingSource: number = 0;
let paddingOutput: number = 0;

let bgColor: string = '#bbbbbb'; // #ff0000 // red
let bgAlpha: number = 100;

let renderTileIds: boolean = false;

let inputTileSetId: number = 0;
let outputTileSetId: number = 1;
let selectedInputTileSet: TileSet = TILE_SETS[inputTileSetId];
let selectedOutputTileSet: TileSet = TILE_SETS[outputTileSetId];

// ================================================================= //
// Expose global functions

(window as any).onLoad = onLoad;

(window as any).onImageUpload = onImageUpload;

(window as any).onTileSizeChange = onTileSizeChange;
(window as any).onNumRowsChange = onNumRowsChange;
(window as any).onNumColsChange = onNumColsChange;

(window as any).onUpdateSourcePadding = onUpdateSourcePadding;
(window as any).onUpdateOutputPadding = onUpdateOutputPadding;

(window as any).onUpdateBgColor = onUpdateBgColor;
(window as any).onUpdateBgAlpha = onUpdateBgAlpha;

(window as any).onToggleRenderTileIds = onToggleRenderTileIds;

(window as any).onProcessImage = onProcessImage;

(window as any).onUpdateInputTileSet = onUpdateInputTileSet;
(window as any).onUpdateOutputTileSet = onUpdateOutputTileSet;

// ================================================================= //
// Global Functions

function onLoad(): void {
  console.log(`App Updated last: `, APP_UPDATE_DATE);
  console.log('// ===================== onLoad() ======================== //');
  makeBitMaskTiles();
  populateTileSelects();
  syncStateWithHtml();
  onUpdateInputTileSet();
}

function makeBitMaskTiles(): void {
  // console.log('makeBitMaskTiles()');
  // const bitMaskImageElement: HTMLImageElement = document.createElement('img');
  const bitMaskImageElement: HTMLImageElement = new Image();
  // document.body.append(bitMaskImageElement);
  bitMaskImageElement.src = BIT_MASK_IMAGE_SRC;

  console.log(
    bitMaskImageElement,
    bitMaskImageElement.width,
    bitMaskImageElement.height,
  );

  const bitMaskTileSize = Math.max(
    bitMaskImageElement.width / BIT_MASK_TILE_SET.numCols,
    bitMaskImageElement.height / BIT_MASK_TILE_SET.numRows,
  );
  bitMaskTiles = cutImageIntoTiles(
    bitMaskImageElement,
    bitMaskTileSize,
    BIT_MASK_TILE_SET,
    paddingOutput,
  );
  console.log({ bitMaskImageElement, bitMaskTileSize, bitMaskTiles });
  reRenderInputImageBitMask();
  reRenderOutputImageBitMask();
}

function syncStateWithHtml(): void {
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

function populateTileSelects(): void {
  createHTMLSelectOptions(HTML_ELEMENTS.inputTileSetSelect, TILE_SET_OPTIONS);
  createHTMLSelectOptions(HTML_ELEMENTS.outputTileSetSelect, TILE_SET_OPTIONS);
}

function createHTMLSelectOptions(
  selectElement: HTMLSelectElement,
  optionsArray: SelectOption[],
): void {
  const fragment: DocumentFragment = document.createDocumentFragment();

  optionsArray.forEach((optionData: SelectOption) => {
    const option: HTMLOptionElement = document.createElement('option');
    option.text = optionData.name;
    option.value = `${optionData.value}`;
    fragment.appendChild(option);
  });

  selectElement.innerHTML = '';
  selectElement.appendChild(fragment);
}

async function onImageUpload(): Promise<void> {
  const file: File | undefined = HTML_ELEMENTS.imageInput.files?.[0];
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

function onTileSizeChange(): void {
  console.warn('onTileSizeChange not implemented');
}
function onNumRowsChange(): void {
  console.warn('onNumRowsChange not implemented');
}
function onNumColsChange(): void {
  console.warn('onNumColsChange not implemented');
}

function onUpdateSourcePadding(): void {
  paddingSource = parseInt(HTML_ELEMENTS.sourcePaddingInput.value) || 0;
  recalculateInputImageVars();
  reRenderInputImagePreview();
  reRenderOutputImagePreview();
}

function onUpdateOutputPadding(): void {
  paddingOutput = parseInt(HTML_ELEMENTS.outputPaddingInput.value) || 0;
  reRenderInputImagePreview();
  reRenderOutputImagePreview();
  reRenderInputImageBitMask();
  reRenderOutputImageBitMask();
}

function onUpdateBgColor(): void {
  bgColor = HTML_ELEMENTS.bgColorInput.value;
}

function onUpdateBgAlpha(): void {
  bgAlpha = HTML_ELEMENTS.bgAlphaInput.valueAsNumber;
}

export function onToggleRenderTileIds(): void {
  renderTileIds = !renderTileIds;
  reRenderInputImagePreview();
  reRenderOutputImagePreview();
}

function onProcessImage(): void {
  reRenderInputImagePreview();
  reRenderOutputImagePreview();
}

function onUpdateInputTileSet(): void {
  inputTileSetId = parseInt(HTML_ELEMENTS.inputTileSetSelect.value);
  selectedInputTileSet = TILE_SETS[inputTileSetId];
  reRenderInputImageBitMask();

  recalculateRowsCols();
  recalculateInputImageVars();
  reRenderInputImagePreview();
  reRenderOutputImagePreview();
}

function onUpdateOutputTileSet(): void {
  outputTileSetId = parseInt(HTML_ELEMENTS.outputTileSetSelect.value);
  selectedOutputTileSet = TILE_SETS[outputTileSetId];
  reRenderOutputImageBitMask();

  reRenderOutputImagePreview();
  reRenderInputImageBitMask();
}

// ================================================================= //
// Helper functions

function recalculateRowsCols(): void {
  numRows = selectedInputTileSet.numRows;
  numCols = selectedInputTileSet.numCols;

  HTML_ELEMENTS.rowsInput.valueAsNumber = numRows;
  HTML_ELEMENTS.columnsInput.valueAsNumber = numCols;
}

/** Recalculates tile size, rows, columns based on image and tile set selected */
function recalculateInputImageVars(): void {
  const image: HTMLImageElement | undefined = inputImage;
  if (checkImageLoaded(image)) {
    tileSize = Math.max(image.width / numCols, image.height / numRows);
    imageTiles = cutImageIntoTiles(
      image,
      tileSize,
      selectedInputTileSet,
      paddingSource,
    );
  } else {
    tileSize = 0;
    imageTiles = undefined;
  }
  HTML_ELEMENTS.tileSizeInput.valueAsNumber = tileSize;
}

function reRenderInputImageBitMask(): void {
  if (bitMaskTiles) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      bitMaskTiles,
      selectedInputTileSet,
      paddingOutput,
      new Color(bgColor, bgAlpha),
      renderTileIds,
    );
    HTML_ELEMENTS.inputImageBitMask.src = tileRender.src;
    HTML_ELEMENTS.inputImageBitMaskLink.href = tileRender.src;
    HTML_ELEMENTS.inputImageBitMaskDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
  }
}

function reRenderOutputImageBitMask(): void {
  if (bitMaskTiles) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      bitMaskTiles,
      selectedOutputTileSet,
      paddingOutput,
      new Color(bgColor, bgAlpha),
      renderTileIds,
    );
    HTML_ELEMENTS.outputImageBitMask.src = tileRender.src;
    HTML_ELEMENTS.outputImageBitMaskLink.href = tileRender.src;
    HTML_ELEMENTS.outputImageBitMaskDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
  }
}

function reRenderInputImagePreview(): void {
  if (imageTiles) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      imageTiles,
      selectedInputTileSet,
      paddingOutput,
      new Color(bgColor, bgAlpha),
      renderTileIds,
    );
    HTML_ELEMENTS.inputImagePreview.src = tileRender.src;
    HTML_ELEMENTS.inputImagePreviewLink.href = tileRender.src;
    HTML_ELEMENTS.inputImagePreviewDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
  }
}

function reRenderOutputImagePreview(): void {
  if (imageTiles) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      imageTiles,
      selectedOutputTileSet,
      paddingOutput,
      new Color(bgColor, bgAlpha),
      renderTileIds,
    );
    HTML_ELEMENTS.outputImagePreview.src = tileRender.src;
    HTML_ELEMENTS.outputImagePreviewLink.href = tileRender.src;
    HTML_ELEMENTS.outputImagePreviewDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
  }
}
