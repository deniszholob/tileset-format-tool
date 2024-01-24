import { APP_UPDATE_DATE } from '../app-update.js';
import { TileSet } from '../classes/TileSet.model.js';
import { DEFAULT_TILE_SETS } from '../data/tile-set_default.data.js';
import { generateBitMaskTiles, renderTileSet } from '../tile-set-renderer.js';
import { getRenderImageFromTiles, } from '../tile-set-worker.js';
import { Color, existSavedTileSets, loadTileSetsToLocalStorage, saveTileSetsToLocalStorage, } from '../util.js';
import { HtmlElementsEditorPage } from './html-elements.js';
console.log('// ===================== Editor.ts ======================== //');
// ================================================================= //
// State
const HTML_ELEMENTS = new HtmlElementsEditorPage();
let TILE_SETS = DEFAULT_TILE_SETS;
let bitMaskTiles = undefined;
let newTileSetName = 'New';
let newTileSetLink = '';
let newTileSetConfig = '[\n  [28, 112],\n  [  7, 193]\n]';
// ================================================================= //
// Expose global functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onLoad = onLoad;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onSaveTileSets = onSaveTileSets;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onDownloadTileSets = onDownloadTileSets;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetNew = editTileSetNew;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetAdd = editTileSetAdd;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetCancel = editTileSetCancel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetReset = editTileSetReset;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetEdit = editTileSetEdit;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetDelete = editTileSetDelete;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateEditTileSetName = onUpdateEditTileSetName;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateEditTileSetLink = onUpdateEditTileSetLink;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateEditTileSetConfig = onUpdateEditTileSetConfig;
// ================================================================= //
// Global Functions
function onLoad() {
    console.log('// ================= onLoad() - Editor ==================== //');
    console.log(`App Updated last: `, APP_UPDATE_DATE);
    HTML_ELEMENTS.updateDate.innerHTML = APP_UPDATE_DATE;
    loadTileSets();
    syncStateWithHtml();
    makeBitMaskTiles();
}
function makeBitMaskTiles() {
    const bitMaskImageElement = HTML_ELEMENTS.bitMask;
    bitMaskTiles = generateBitMaskTiles(bitMaskImageElement);
    updatePreview();
}
function syncStateWithHtml() {
    HTML_ELEMENTS.editTileSetName.value = newTileSetName;
    HTML_ELEMENTS.editTileSetLink.value = newTileSetLink;
    HTML_ELEMENTS.editTileSetConfig.value = newTileSetConfig;
}
function onSaveTileSets() {
    saveTileSetsToLocalStorage(TILE_SETS);
}
function onDownloadTileSets() {
    console.log(TILE_SETS.toJson());
}
function loadTileSets() {
    TILE_SETS = existSavedTileSets()
        ? loadTileSetsToLocalStorage()
        : DEFAULT_TILE_SETS;
}
function editTileSetReset() {
    newTileSetName = '';
    newTileSetLink = '';
    newTileSetConfig = '';
}
function editTileSetNew() {
    HTML_ELEMENTS.editorSpace.classList.remove('hidden');
}
function editTileSetCancel() {
    HTML_ELEMENTS.editorSpace.classList.add('hidden');
}
function editTileSetAdd() { }
function editTileSetEdit() {
    HTML_ELEMENTS.editorSpace.classList.remove('hidden');
}
function editTileSetDelete() { }
function onUpdateEditTileSetName() {
    newTileSetName = HTML_ELEMENTS.editTileSetName.value;
    updatePreview();
}
function onUpdateEditTileSetLink() {
    newTileSetLink = HTML_ELEMENTS.editTileSetLink.value;
    updatePreview();
}
function onUpdateEditTileSetConfig() {
    newTileSetConfig = HTML_ELEMENTS.editTileSetConfig.value;
    updatePreview();
}
function updatePreview() {
    if (bitMaskTiles) {
        try {
            const set = JSON.parse(newTileSetConfig);
            const tileSet = new TileSet({
                name: newTileSetName,
                link: newTileSetLink,
                set,
            });
            // TODO: Temp
            const tileBorderSize = 1;
            const bgColor = '#000000';
            const bgAlpha = 100;
            const doRenderTileIds = true;
            const tileRender = getRenderImageFromTiles(bitMaskTiles, tileSet, tileBorderSize, new Color(bgColor, bgAlpha), doRenderTileIds);
            HTML_ELEMENTS.editTileSetPreviewName.innerText = newTileSetName;
            renderTileSet(tileRender, HTML_ELEMENTS.editTileSetPreview, HTML_ELEMENTS.editTileSetPreviewLink, HTML_ELEMENTS.editTileSetPreviewDimensions, newTileSetName);
            HTML_ELEMENTS.editTileSetPreviewError.innerText = '';
        }
        catch (error) {
            // console.error(error);
            HTML_ELEMENTS.editTileSetPreviewError.innerText = String(error);
        }
    }
}
