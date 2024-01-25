import { APP_UPDATE_DATE } from '../../app-update.js';
import { SelectOption } from '../../classes/SelectOption.model.js';
import { TileSet } from '../../classes/TileSet.model.js';
import { TileSets } from '../../classes/TileSets.model.js';
import { DEFAULT_TILE_SETS } from '../../data/tile-set_default.data.js';
// import { DEFAULT_TILE_SETS } from '../../data/tile-set_default.data.js';
import { BIT_MASK_TILE_SET } from '../../data/tile-set-bit-mask.data.js';
import {
  existSavedTileSets,
  loadTileSetsToLocalStorage,
} from '../../util/data-util.ts.js';
import {
  checkImageLoaded,
  Color,
  getImageFromFile,
} from '../../util/html-util.js';
import {
  generateBitMaskTiles,
  renderTileSet,
} from '../../util/tile-set-renderer.js';
import {
  cutImageIntoTiles,
  getRenderImageFromTiles,
  RenderImage,
  RenderSet,
} from '../../util/tile-set-worker.js';
import { HtmlElementsMainPage } from './html-elements.js';

// console.log(TILE_SETS);
// console.log(TILE_SET_OPTIONS);

// ================================================================= //
// State

console.log('// ===================== Main.ts ======================== //');
const HTML_ELEMENTS = new HtmlElementsMainPage();
let TILE_SETS: TileSets = DEFAULT_TILE_SETS;
let TILE_SET_OPTIONS: SelectOption[] = TILE_SETS.toSelectOptions();

interface UserUpload {
  fileName: string;
  fileExtension: string;
  image: HTMLImageElement;
}

let userUpload: UserUpload | undefined = undefined;
let imageRenderSet: RenderSet | undefined = undefined;
let bitMaskRenderSet: RenderSet | undefined = undefined;

let tileSize: number = 32;
let numRows: number = 1;
let numCols: number = 1;

// craftpix-top tiles
// let outerBorderSize: number = 3;
// let borderSizeSource: number = 7;
let outerBorderSize: number = 0;
let borderSizeSource: number = 0;
let borderSizeOutput: number = 0;

let bgColor: string = '#bbbbbb';
// let bgColor: string = '#ff0000'; // red
let bgAlpha: number = 100;

let doRenderTileIds: boolean = false;

let inputTileSetId: number = 1;
let outputTileSetId: number = 0;
let selectedInputTileSet: TileSet = getSelectedTileSet(inputTileSetId);
let selectedOutputTileSet: TileSet = getSelectedTileSet(outputTileSetId);

// ================================================================= //
// Expose global functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onLoad = onLoad;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onImageUpload = onImageUpload;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onTileSizeChange = onTileSizeChange;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onNumRowsChange = onNumRowsChange;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onNumColsChange = onNumColsChange;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSourceImageBorderSize = onUpdateSourceImageBorderSize;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSourceBorderSize = onUpdateSourceBorderSize;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateOutputBorderSize = onUpdateOutputBorderSize;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateBgColor = onUpdateBgColor;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateBgAlpha = onUpdateBgAlpha;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onToggleRenderTileIds = onToggleRenderTileIds;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onProcessImage = onProcessImage;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateInputTileSet = onUpdateInputTileSet;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateOutputTileSet = onUpdateOutputTileSet;

// ================================================================= //
// Global Functions

function onLoad(): void {
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

function getSelectedTileSet(idx: number): TileSet {
  return TILE_SETS.sets?.[idx] ?? BIT_MASK_TILE_SET;
}

function loadTileSets(): void {
  TILE_SETS = existSavedTileSets()
    ? loadTileSetsToLocalStorage()
    : DEFAULT_TILE_SETS;
  TILE_SET_OPTIONS = TILE_SETS.toSelectOptions();
}

function makeBitMaskTiles(): void {
  const bitMaskImageElement: HTMLImageElement = HTML_ELEMENTS.bitMask;
  bitMaskRenderSet = generateBitMaskTiles(bitMaskImageElement);
  reRenderInputImageBitMask();
  reRenderOutputImageBitMask();
}

function syncStateWithHtml(): void {
  HTML_ELEMENTS.tileSizeInput.valueAsNumber = tileSize;
  HTML_ELEMENTS.rowsInput.valueAsNumber = numRows;
  HTML_ELEMENTS.columnsInput.valueAsNumber = numCols;

  HTML_ELEMENTS.sourceImageBorderSizeInput.valueAsNumber = outerBorderSize;
  HTML_ELEMENTS.sourceBorderSizeInput.valueAsNumber = borderSizeSource;
  HTML_ELEMENTS.outputBorderSizeInput.valueAsNumber = borderSizeOutput;

  HTML_ELEMENTS.bgColorInput.value = bgColor;
  HTML_ELEMENTS.bgAlphaInput.valueAsNumber = bgAlpha;

  HTML_ELEMENTS.renderTileIds.checked = doRenderTileIds;

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

  const image = await getImageFromFile(file);
  const [fileName, fileExtension] = file.name.split('.');
  userUpload = { image, fileExtension, fileName };
  HTML_ELEMENTS.uploadImagePreview.src = userUpload.image.src;
  HTML_ELEMENTS.uploadImageDimensions.textContent = `${userUpload.image.width}x${userUpload.image.height}`;

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

function onUpdateSourceImageBorderSize(): void {
  outerBorderSize =
    parseInt(HTML_ELEMENTS.sourceImageBorderSizeInput.value) || 0;
  recalculateInputImageVars();
  reRenderInputImagePreview();
  reRenderOutputImagePreview();
}

function onUpdateSourceBorderSize(): void {
  borderSizeSource = parseInt(HTML_ELEMENTS.sourceBorderSizeInput.value) || 0;
  recalculateInputImageVars();
  reRenderInputImagePreview();
  reRenderOutputImagePreview();
}

function onUpdateOutputBorderSize(): void {
  borderSizeOutput = parseInt(HTML_ELEMENTS.outputBorderSizeInput.value) || 0;
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
  doRenderTileIds = !doRenderTileIds;
  reRenderInputImagePreview();
  reRenderOutputImagePreview();
  reRenderInputImageBitMask();
  reRenderOutputImageBitMask();
}

function onProcessImage(): void {
  reRenderInputImagePreview();
  reRenderOutputImagePreview();
  reRenderInputImageBitMask();
  reRenderOutputImageBitMask();
}

function onUpdateInputTileSet(): void {
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

function onUpdateOutputTileSet(): void {
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

function recalculateRowsCols(): void {
  numRows = selectedInputTileSet.numRows;
  numCols = selectedInputTileSet.numCols;

  HTML_ELEMENTS.rowsInput.valueAsNumber = numRows;
  HTML_ELEMENTS.columnsInput.valueAsNumber = numCols;
}

/** Recalculates tile size, rows, columns based on image and tile set selected */
function recalculateInputImageVars(): void {
  const image: HTMLImageElement | undefined = userUpload?.image;
  if (checkImageLoaded(image)) {
    tileSize = getTileSizeFromImage(image, outerBorderSize);
    imageRenderSet = cutImageIntoTiles(
      image,
      tileSize,
      selectedInputTileSet,
      borderSizeSource,
      outerBorderSize,
    );
  } else {
    tileSize = 0;
    imageRenderSet = undefined;
  }
  HTML_ELEMENTS.tileSizeInput.valueAsNumber = tileSize;
}

function getTileSizeFromImage(
  image: HTMLImageElement,
  imageBorderSize: number = 0,
): number {
  const effectiveImageWidth = image.width - 2 * imageBorderSize;
  const effectiveImageHeight = image.height - 2 * imageBorderSize;
  return Math.max(
    effectiveImageWidth / numCols,
    effectiveImageHeight / numRows,
  );
}

function reRenderInputImageBitMask(): void {
  if (bitMaskRenderSet) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      bitMaskRenderSet,
      selectedInputTileSet,
      borderSizeOutput,
      new Color(bgColor, bgAlpha),
      doRenderTileIds,
    );
    renderTileSet(
      tileRender,
      HTML_ELEMENTS.inputImageBitMask,
      HTML_ELEMENTS.inputImageBitMaskLink,
      HTML_ELEMENTS.inputImageBitMaskDimensions,
      getDownloadLink(true, selectedInputTileSet.name),
    );
  }
}

function reRenderOutputImageBitMask(): void {
  if (bitMaskRenderSet) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      bitMaskRenderSet,
      selectedOutputTileSet,
      borderSizeOutput,
      new Color(bgColor, bgAlpha),
      doRenderTileIds,
    );
    renderTileSet(
      tileRender,
      HTML_ELEMENTS.outputImageBitMask,
      HTML_ELEMENTS.outputImageBitMaskLink,
      HTML_ELEMENTS.outputImageBitMaskDimensions,
      getDownloadLink(true, selectedOutputTileSet.name),
    );
  }
}

function reRenderInputImagePreview(): void {
  if (imageRenderSet && userUpload) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      imageRenderSet,
      selectedInputTileSet,
      borderSizeOutput,
      new Color(bgColor, bgAlpha),
      doRenderTileIds,
    );

    renderTileSet(
      tileRender,
      HTML_ELEMENTS.inputImagePreview,
      HTML_ELEMENTS.inputImagePreviewLink,
      HTML_ELEMENTS.inputImagePreviewDimensions,
      getDownloadLink(
        false,
        selectedInputTileSet.name,
        selectedInputTileSet.name,
      ),
    );
  }
}

function reRenderOutputImagePreview(): void {
  if (imageRenderSet && userUpload) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      imageRenderSet,
      selectedOutputTileSet,
      borderSizeOutput,
      new Color(bgColor, bgAlpha),
      doRenderTileIds,
    );
    renderTileSet(
      tileRender,
      HTML_ELEMENTS.outputImagePreview,
      HTML_ELEMENTS.outputImagePreviewLink,
      HTML_ELEMENTS.outputImagePreviewDimensions,
      getDownloadLink(
        false,
        selectedOutputTileSet.name,
        selectedOutputTileSet.name,
      ),
    );
  }
}

function getDownloadLink(
  isBitMask: boolean,
  tileSetName: string,
  inputTileSetName?: string,
): string {
  const fileExtension =
    !userUpload?.fileExtension || !isBitMask ? 'png' : userUpload.fileExtension;
  const fileName = userUpload?.fileName ? `${userUpload?.fileName}_` : '';
  const bitMaskName = isBitMask ? '_BitMask' : '';
  const downloadName = `${fileName.replace(inputTileSetName ?? '', '')}${tileSetName}${bitMaskName}`;
  return `${downloadName}.${fileExtension}`;
}
