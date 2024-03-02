import { EditorPageComponent } from './editor-page.component.js';
// ================================================================= //
// State
const editorPageComponent = new EditorPageComponent();
// ================================================================= //
// Expose global functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onLoad = onLoad;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onSaveTileSets = () => editorPageComponent.onSaveTileSets();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUploadTileSets = () => editorPageComponent.onUploadTileSets();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onDownloadTileSets = () => editorPageComponent.onDownloadTileSets();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onResetTileSets = () => editorPageComponent.onResetTileSets();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateEditTileSetName = () => editorPageComponent.onUpdateEditTileSetName();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateEditTileSetLink = () => editorPageComponent.onUpdateEditTileSetLink();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateEditTileSetConfig = () => editorPageComponent.onUpdateEditTileSetConfig();
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any).editTileSetSave = () => editorPageComponent.editTileSetSave();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetAdd = () => editorPageComponent.editTileSetAdd();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetCancel = () => editorPageComponent.editTileSetCancel();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetReset = () => editorPageComponent.editTileSetReset();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onClearTileSets = () => editorPageComponent.onClearTileSets();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.editTileSetNew = () => editorPageComponent.editTileSetNew();
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any).editTileSetEdit = () => editorPageComponent.editTileSetEdit();
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any).editTileSetDelete = () => editorPageComponent.editTileSetDelete();
// ================================================================= //
// Global Functions
function onLoad() {
    console.log('// ================= onLoad() - Editor ==================== //');
}
