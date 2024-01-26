import { APP_UPDATE_DATE } from '../../app-update.js';
import { SelectOption } from '../../classes/SelectOption.model.js';
import { TileSet } from '../../classes/TileSet.model.js';
import { TileSets } from '../../classes/TileSets.model.js';
import { DEFAULT_TILE_SETS } from '../../data/tile-set_default.data.js';
// import { DEFAULT_TILE_SETS } from '../../data/tile-set_default.data.js';
import {
  clearTileSetsFromLocalStorage,
  csvToMatrix,
  downloadJSONtoFile,
  existSavedTileSets,
  loadTileSetsFromLocalStorage,
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
import { HTMLElementsEditorListItemTemplate } from './html-elements-editor-list-item-template.js';

console.log('// ===================== Editor.ts ======================== //');

const DEFAULT_TILE_SET_NAME = 'New';
const DEFAULT_TILE_SET_LINK = '';
const DEFAULT_TILE_SET_CONFIG: string = ',28,112\n255,7,193,255_a';

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
(window as any).onUploadTileSets = onUploadTileSets;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onDownloadTileSets = onDownloadTileSets;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onResetTileSets = onResetTileSets;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateEditTileSetName = onUpdateEditTileSetName;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateEditTileSetLink = onUpdateEditTileSetLink;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateEditTileSetConfig = onUpdateEditTileSetConfig;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetSave = editTileSetSave;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetAdd = editTileSetAdd;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetCancel = editTileSetCancel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetReset = editTileSetReset;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onClearTileSets = onClearTileSets;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetNew = editTileSetNew;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetEdit = editTileSetEdit;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetDelete = editTileSetDelete;

// ================================================================= //
// Global Functions

function onLoad(): void {
  console.log('// ================= onLoad() - Editor ==================== //');
  HTML_ELEMENTS.updateDate.innerHTML = APP_UPDATE_DATE;
  HTML_ELEMENTS.editTileSetConfig.placeholder = DEFAULT_TILE_SET_CONFIG;
  loadTileSets();
  syncStateWithHtml();
  makeBitMaskTiles();
  renderConfig();
}

function loadTileSets(): void {
  TILE_SETS = existSavedTileSets()
    ? loadTileSetsFromLocalStorage()
    : DEFAULT_TILE_SETS;
}

function syncStateWithHtml(): void {
  HTML_ELEMENTS.editTileSetName.value = newTileSetName;
  HTML_ELEMENTS.editTileSetLink.value = newTileSetLink;
  HTML_ELEMENTS.editTileSetConfig.value = newTileSetConfig;
}

function makeBitMaskTiles(): void {
  const bitMaskImageElement: HTMLImageElement = HTML_ELEMENTS.bitMask;
  bitMaskTiles = generateBitMaskTiles(bitMaskImageElement);
  updatePreview();
}

// ------------------------------------------------------------------ //

function onSaveTileSets(): void {
  TILE_SETS.sets.filter((v) => !!v);
  saveTileSetsToLocalStorage(TILE_SETS);
  renderConfig();
}

function onUploadTileSets(): void {
  const json: string | null = prompt('Paste json to save to local storage');
  if (!json) return;

  try {
    const jsonParsed: TileSets = TileSets.getTileSetsFromJson(json);
    TILE_SETS = jsonParsed;
    onSaveTileSets();
  } catch (error) {
    alert(error);
  }
}

function onDownloadTileSets(): void {
  if (existSavedTileSets()) {
    const fileName: string = 'TileSetsConfig';
    const json: string = TILE_SETS.toJson(2);
    downloadJSONtoFile(json, fileName);
  } else {
    alert('No saved Tile Sets');
  }
}

function onResetTileSets(): void {
  const yes: boolean = confirm(
    'Are you sure you want to reset the Tile Sets?\n You can download first before resetting',
  );
  if (yes) {
    clearTileSetsFromLocalStorage();
    loadTileSets();
    renderConfig();
  }
}

function onClearTileSets(): void {
  const yes: boolean = confirm(
    'Are you sure you want to clear the Tile Sets?\n You can download first before clearing',
  );
  if (yes) {
    TILE_SETS = new TileSets();
    saveTileSetsToLocalStorage(TILE_SETS);
    renderConfig();
  }
}

// ------------------------------------------------------------------ //

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
  newTileSetConfig = newTileSetConfig
    .replaceAll('[', '')
    .replaceAll('],', '')
    .replaceAll(']', '')
    .replaceAll(' ', '');
  HTML_ELEMENTS.editTileSetConfig.value = newTileSetConfig;
  updatePreview();
}

function updatePreview(): void {
  if (bitMaskTiles) {
    try {
      const tileSet: TileSet = new TileSet({
        name: newTileSetName,
        link: newTileSetLink,
        set: csvToMatrix(newTileSetConfig),
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
      HTML_ELEMENTS.editTileSetPreviewError.innerText = String(error);
    }
  }
}

// ------------------------------------------------------------------ //
function editTileSetSave(index: number): void {
  // TODO: Save to tilesets
  if (TILE_SETS.sets[index]) {
    const saveTileSet: TileSet = new TileSet({
      name: newTileSetName,
      link: newTileSetLink,
      set: csvToMatrix(newTileSetConfig),
    });
    TILE_SETS.sets[index] = saveTileSet;
    saveTileSetsToLocalStorage(TILE_SETS);
    editTileSetReset();
    editTileSetCancel();
    renderConfig();
  } else {
    editTileSetAdd();
  }
}

function editTileSetAdd(): void {
  const newTileSet: TileSet = new TileSet({
    name: newTileSetName,
    link: newTileSetLink,
    set: csvToMatrix(newTileSetConfig),
  });
  TILE_SETS.sets.push(newTileSet);
  saveTileSetsToLocalStorage(TILE_SETS);
  editTileSetReset();
  editTileSetCancel();
  renderConfig();
}

function editTileSetCancel(): void {
  HTML_ELEMENTS.editorSpace.classList.add('hidden');
  // Default to "Add"
  HTML_ELEMENTS.editTileSetSave.classList.add('hidden');
  HTML_ELEMENTS.editTileSetAdd.classList.remove('hidden');
}

function editTileSetReset(): void {
  newTileSetName = DEFAULT_TILE_SET_NAME;
  newTileSetLink = DEFAULT_TILE_SET_LINK;
  newTileSetConfig = DEFAULT_TILE_SET_CONFIG;
  syncStateWithHtml();
  updatePreview();
}

// ------------------------------------------------------------------ //

/** https://stackoverflow.com/questions/3163615/how-to-scroll-an-html-page-to-a-given-anchor */
function scrollToEditor(): void {
  HTML_ELEMENTS.editorSpace.scrollIntoView({
    block: 'nearest',
    behavior: 'smooth',
  });
}

function editTileSetNew(): void {
  HTML_ELEMENTS.editorSpace.classList.remove('hidden');
  HTML_ELEMENTS.editTileSetSave.classList.add('hidden');
  HTML_ELEMENTS.editTileSetAdd.classList.remove('hidden');
  scrollToEditor();
  editTileSetReset();
}

function editTileSetDelete(index: number): void {
  const yes: boolean = confirm(
    'Are you sure you want to delete this tile set?',
  );
  if (yes) {
    TILE_SETS.sets.splice(index, 1).filter((v) => !!v);

    HTML_ELEMENTS.editTileSetSave.removeEventListener('click', () => {
      editTileSetSave(index);
    });

    saveTileSetsToLocalStorage(TILE_SETS);
    renderConfig();
  }
}

function editTileSetEdit(index: number): void {
  HTML_ELEMENTS.editorSpace.classList.remove('hidden');
  HTML_ELEMENTS.editTileSetSave.classList.remove('hidden');
  HTML_ELEMENTS.editTileSetAdd.classList.add('hidden');
  scrollToEditor();

  HTML_ELEMENTS.editTileSetSave.addEventListener(
    'click',
    () => {
      editTileSetSave(index);
    },
    { once: true },
  );

  newTileSetName = TILE_SETS.sets[index].name;
  newTileSetLink = TILE_SETS.sets[index].link ?? '';
  newTileSetConfig = TILE_SETS.sets[index].toSetCSV();

  syncStateWithHtml();
  updatePreview();
}

function renderConfig(): void {
  HTML_ELEMENTS.editorList.innerHTML = '';
  TILE_SETS.sets.forEach((tileSet: TileSet, index: number) => {
    const item = createEditorListItemHtmlInstance(index, tileSet);
    HTML_ELEMENTS.editorList.appendChild(item);
  });
}

function createEditorListItemHtmlInstance(
  idx: number,
  tileSet: TileSet,
): DocumentFragment {
  const option: SelectOption = tileSet.toSelectOption(idx);
  // if (!HTML_ELEMENTS.editorListItemTemplate?.content) {
  //   throw new Error('Templates not supported in this browser :(');
  // }

  const clone: DocumentFragment =
    HTML_ELEMENTS.editorListItemTemplate.content.cloneNode(
      true,
    ) as DocumentFragment;
  const HTML_TEMPLATE_ELEMENTS = new HTMLElementsEditorListItemTemplate(
    clone,
    idx,
  );
  HTML_TEMPLATE_ELEMENTS.editorListItemTemplateDelete.addEventListener(
    'click',
    () => {
      editTileSetDelete(idx);
    },
  );
  HTML_TEMPLATE_ELEMENTS.editorListItemTemplateEdit.addEventListener(
    'click',
    () => {
      editTileSetEdit(idx);
    },
  );
  HTML_TEMPLATE_ELEMENTS.editorListItemTemplateDisplay.innerHTML = option.name;
  HTML_TEMPLATE_ELEMENTS.editorListItemTemplateLink.href = tileSet.link ?? '';
  HTML_TEMPLATE_ELEMENTS.editorListItemTemplateLink.innerHTML = tileSet.link
    ? '<i class="fa fa-external-link"></i>' //'🔗' //tileSet.name
    : '';
  renderEditorListItemPreview(
    tileSet,
    HTML_TEMPLATE_ELEMENTS.editorListItemTemplatePreview,
  );
  return clone;
}

function renderEditorListItemPreview(
  tileSet: TileSet,
  /** Image Element to render to */
  outputImageElement: HTMLImageElement,
) {
  if (bitMaskTiles) {
    // TODO: Temp
    const tileBorderSize = 1;
    const bgColor = '#000000';
    const bgAlpha = 100;
    const doRenderTileIds = true;

    const renderImage: RenderImage = getRenderImageFromTiles(
      bitMaskTiles,
      tileSet,
      tileBorderSize,
      new Color(bgColor, bgAlpha),
      doRenderTileIds,
    );

    outputImageElement.src = renderImage.src;
  } else {
    console.warn(`No bitMaskTiles`, bitMaskTiles);
  }
}
