import { APP_UPDATE_DATE } from '../../app-update.js';
import { TileSet } from '../../classes/TileSet.model.js';
import { TileSets } from '../../classes/TileSets.model.js';
import { DEFAULT_TILE_SETS } from '../../data/tile-set_default.data.js';
// import { DEFAULT_TILE_SETS } from '../../data/tile-set_default.data.js';
import {
  csvToMatrix,
  existSavedTileSets,
  loadTileSetsToLocalStorage,
  saveTileSetsToLocalStorage,
} from '../../util/data-util.ts.js';
import { Color } from '../../util/html-util.js';
import {
  generateBitMaskTiles,
  renderTileSet,
} from '../../util/tile-set-renderer.js';
import {
  getRenderImageFromTiles,
  RenderImage,
  RenderSet,
} from '../../util/tile-set-worker.js';
import { HtmlElementsEditorPage } from './html-elements.js';

console.log('// ===================== Editor.ts ======================== //');

const DEFAULT_TILE_SET_NAME = 'New';
const DEFAULT_TILE_SET_LINK = '';
const DEFAULT_TILE_SET_CONFIG: string = '28, 112\n7, 193';

// ================================================================= //
// State

const HTML_ELEMENTS = new HtmlElementsEditorPage();
let TILE_SETS: TileSets = DEFAULT_TILE_SETS;
let bitMaskTiles: RenderSet | undefined = undefined;

let newTileSetName: string = DEFAULT_TILE_SET_NAME;
let newTileSetLink: string = DEFAULT_TILE_SET_LINK;
let newTileSetConfig: string = DEFAULT_TILE_SET_CONFIG;

// ================================================================= //
// Expose global functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onLoad = onLoad;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onSaveTileSets = onSaveTileSets;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onDownloadTileSets = onDownloadTileSets;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetNew = editTileSetNew;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetAdd = editTileSetAdd;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetCancel = editTileSetCancel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetReset = editTileSetReset;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetEdit = editTileSetEdit;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetDelete = editTileSetDelete;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateEditTileSetName = onUpdateEditTileSetName;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateEditTileSetLink = onUpdateEditTileSetLink;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateEditTileSetConfig = onUpdateEditTileSetConfig;

// ================================================================= //
// Global Functions

function onLoad(): void {
  console.log('// ================= onLoad() - Editor ==================== //');
  console.log(`App Updated last: `, APP_UPDATE_DATE);
  HTML_ELEMENTS.updateDate.innerHTML = APP_UPDATE_DATE;
  HTML_ELEMENTS.editTileSetConfig.placeholder = DEFAULT_TILE_SET_CONFIG;
  loadTileSets();
  syncStateWithHtml();
  makeBitMaskTiles();
}

function makeBitMaskTiles(): void {
  const bitMaskImageElement: HTMLImageElement = HTML_ELEMENTS.bitMask;
  bitMaskTiles = generateBitMaskTiles(bitMaskImageElement);
  updatePreview();
}

function syncStateWithHtml(): void {
  HTML_ELEMENTS.editTileSetName.value = newTileSetName;
  HTML_ELEMENTS.editTileSetLink.value = newTileSetLink;
  HTML_ELEMENTS.editTileSetConfig.value = newTileSetConfig;
}

function onSaveTileSets(): void {
  saveTileSetsToLocalStorage(TILE_SETS);
}

function onDownloadTileSets(): void {
  console.log(TILE_SETS.toJson());
}

function loadTileSets(): void {
  TILE_SETS = existSavedTileSets()
    ? loadTileSetsToLocalStorage()
    : DEFAULT_TILE_SETS;
}

function editTileSetReset(): void {
  newTileSetName = DEFAULT_TILE_SET_NAME;
  newTileSetLink = DEFAULT_TILE_SET_LINK;
  newTileSetConfig = DEFAULT_TILE_SET_CONFIG;
  syncStateWithHtml();
  updatePreview();
}

function editTileSetNew(): void {
  HTML_ELEMENTS.editorSpace.classList.remove('hidden');
}

function editTileSetCancel(): void {
  HTML_ELEMENTS.editorSpace.classList.add('hidden');
}

function editTileSetAdd(): void {}

function editTileSetEdit(): void {
  HTML_ELEMENTS.editorSpace.classList.remove('hidden');
}

function editTileSetDelete(): void {}

function onUpdateEditTileSetName(): void {
  newTileSetName = HTML_ELEMENTS.editTileSetName.value;
  updatePreview();
}
function onUpdateEditTileSetLink(): void {
  newTileSetLink = HTML_ELEMENTS.editTileSetLink.value;
  updatePreview();
}
function onUpdateEditTileSetConfig(): void {
  newTileSetConfig = HTML_ELEMENTS.editTileSetConfig.value;
  updatePreview();
}

function updatePreview(): void {
  if (bitMaskTiles) {
    try {
      const set: string[][] = csvToMatrix(newTileSetConfig);
      const tileSet: TileSet = new TileSet({
        name: newTileSetName,
        link: newTileSetLink,
        set,
      });

      // TODO: Temp
      const tileBorderSize = 1;
      const bgColor = '#000000';
      const bgAlpha = 100;
      const doRenderTileIds = true;

      const tileRender: RenderImage = getRenderImageFromTiles(
        bitMaskTiles,
        tileSet,
        tileBorderSize,
        new Color(bgColor, bgAlpha),
        doRenderTileIds,
      );

      HTML_ELEMENTS.editTileSetPreviewName.innerText = newTileSetName;

      renderTileSet(
        tileRender,
        HTML_ELEMENTS.editTileSetPreview,
        HTML_ELEMENTS.editTileSetPreviewLink,
        HTML_ELEMENTS.editTileSetPreviewDimensions,
        newTileSetName,
      );
      HTML_ELEMENTS.editTileSetPreviewError.innerText = '';
    } catch (error: unknown) {
      // console.error(error);
      HTML_ELEMENTS.editTileSetPreviewError.innerText = String(error);
    }
  }
}
