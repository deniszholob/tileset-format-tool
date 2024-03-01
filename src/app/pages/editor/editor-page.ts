import { EditorPageComponent } from './editor-page.component.js';

// ================================================================= //
// State
const editorPageComponent: EditorPageComponent = new EditorPageComponent();

// ================================================================= //
// Expose global functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onLoad = onLoad;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onSaveTileSets = () => editorPageComponent.onSaveTileSets();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUploadTileSets = () => editorPageComponent.onUploadTileSets();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onDownloadTileSets = () =>
  editorPageComponent.onDownloadTileSets();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onResetTileSets = () => editorPageComponent.onResetTileSets();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateEditTileSetName = () =>
  editorPageComponent.onUpdateEditTileSetName();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateEditTileSetLink = () =>
  editorPageComponent.onUpdateEditTileSetLink();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateEditTileSetConfig = () =>
  editorPageComponent.onUpdateEditTileSetConfig();

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any).editTileSetSave = () => editorPageComponent.editTileSetSave();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetAdd = () => editorPageComponent.editTileSetAdd();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetCancel = () =>
  editorPageComponent.editTileSetCancel();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetReset = () => editorPageComponent.editTileSetReset();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onClearTileSets = () => editorPageComponent.onClearTileSets();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).editTileSetNew = () => editorPageComponent.editTileSetNew();
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any).editTileSetEdit = () => editorPageComponent.editTileSetEdit();
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any).editTileSetDelete = () => editorPageComponent.editTileSetDelete();

// ================================================================= //
// Global Functions

function onLoad(): void {
  console.log('// ================= onLoad() - Editor ==================== //');
}
