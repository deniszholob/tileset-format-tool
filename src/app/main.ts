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

interface UserUpload {
  fileName: string;
  fileExtension: string;
  image: HTMLImageElement;
}

let userUpload: UserUpload | undefined = undefined;
let imageTiles: Tile[] | undefined = undefined;
let bitMaskTiles: Tile[] | undefined = undefined;

let tileSize: number = 32;
let numRows: number = 1;
let numCols: number = 1;

let outerBorderSize: number = 0;
let borderSizeSource: number = 0;
let borderSizeOutput: number = 0;

let bgColor: string = '#bbbbbb'; // #ff0000 // red
let bgAlpha: number = 100;

let renderTileIds: boolean = false;

let inputTileSetId: number = 0;
let outputTileSetId: number = 0;
let selectedInputTileSet: TileSet = TILE_SETS[inputTileSetId];
let selectedOutputTileSet: TileSet = TILE_SETS[outputTileSetId];

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
  console.log(`App Updated last: `, APP_UPDATE_DATE);
  console.log('// ===================== onLoad() ======================== //');
  HTML_ELEMENTS.updateDate.innerHTML = APP_UPDATE_DATE;
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

  // console.log(
  //   bitMaskImageElement,
  //   bitMaskImageElement.width,
  //   bitMaskImageElement.height,
  // );

  const bitMaskTileSize = Math.max(
    bitMaskImageElement.width / BIT_MASK_TILE_SET.numCols,
    bitMaskImageElement.height / BIT_MASK_TILE_SET.numRows,
  );
  bitMaskTiles = cutImageIntoTiles(
    bitMaskImageElement,
    bitMaskTileSize,
    BIT_MASK_TILE_SET,
    borderSizeOutput,
  );
  // console.log({ bitMaskImageElement, bitMaskTileSize, bitMaskTiles });
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
  renderTileIds = !renderTileIds;
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

function onUpdateOutputTileSet(): void {
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
    // tileSize = Math.max(image.width / numCols, image.height / numRows);
    tileSize = getTileSizeFromImage(image, outerBorderSize);
    console.log({ tileSize, outerBorderSize });
    imageTiles = cutImageIntoTiles(
      image,
      tileSize,
      selectedInputTileSet,
      borderSizeSource,
      outerBorderSize,
    );
  } else {
    tileSize = 0;
    imageTiles = undefined;
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
  if (bitMaskTiles) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      bitMaskTiles,
      selectedInputTileSet,
      borderSizeOutput,
      new Color(bgColor, bgAlpha),
      renderTileIds,
    );
    HTML_ELEMENTS.inputImageBitMask.src = tileRender.src;
    HTML_ELEMENTS.inputImageBitMaskLink.href = tileRender.src;
    HTML_ELEMENTS.inputImageBitMaskLink.download = getDownloadLink(
      selectedInputTileSet,
      true,
    );
    HTML_ELEMENTS.inputImageBitMaskDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
  }
}

function reRenderOutputImageBitMask(): void {
  if (bitMaskTiles) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      bitMaskTiles,
      selectedOutputTileSet,
      borderSizeOutput,
      new Color(bgColor, bgAlpha),
      renderTileIds,
    );
    HTML_ELEMENTS.outputImageBitMask.src = tileRender.src;
    HTML_ELEMENTS.outputImageBitMaskLink.href = tileRender.src;
    HTML_ELEMENTS.outputImageBitMaskLink.download = getDownloadLink(
      selectedOutputTileSet,
      true,
    );
    HTML_ELEMENTS.outputImageBitMaskDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
  }
}

function reRenderInputImagePreview(): void {
  if (imageTiles && userUpload) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      imageTiles,
      selectedInputTileSet,
      borderSizeOutput,
      new Color(bgColor, bgAlpha),
      renderTileIds,
    );
    HTML_ELEMENTS.inputImagePreview.src = tileRender.src;
    HTML_ELEMENTS.inputImagePreviewLink.href = tileRender.src;
    HTML_ELEMENTS.inputImagePreviewLink.download = getDownloadLink(
      selectedInputTileSet,
      false,
    );
    HTML_ELEMENTS.inputImagePreviewDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
  }
}

function reRenderOutputImagePreview(): void {
  if (imageTiles && userUpload) {
    const tileRender: RenderImage = getRenderImageFromTiles(
      imageTiles,
      selectedOutputTileSet,
      borderSizeOutput,
      new Color(bgColor, bgAlpha),
      renderTileIds,
    );
    HTML_ELEMENTS.outputImagePreview.src = tileRender.src;
    HTML_ELEMENTS.outputImagePreviewLink.href = tileRender.src;
    HTML_ELEMENTS.outputImagePreviewLink.download = getDownloadLink(
      selectedOutputTileSet,
      false,
    );
    HTML_ELEMENTS.outputImagePreviewDimensions.textContent = `${tileRender.width}x${tileRender.height}`;
  }
}

function getDownloadLink(tileSet: TileSet, isBitMask: boolean): string {
  const fileExtension =
    !userUpload?.fileExtension || !isBitMask ? 'png' : userUpload.fileExtension;
  const fileName = userUpload?.fileName ? `${userUpload?.fileName}_` : '';
  const bitMaskName = isBitMask ? '_BitMask' : '';
  const downloadName = `${fileName}${tileSet.name}${bitMaskName}`;
  return `${downloadName}.${fileExtension}`;
}
