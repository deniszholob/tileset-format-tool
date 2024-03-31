import { FormatterPageComponent } from './formatter-page.component.js';
// ================================================================= //
// State
const formatterPageComponent = new FormatterPageComponent();
// ================================================================= //
// Expose global functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onLoad = onLoad;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onImageUpload = () => formatterPageComponent.onImageUpload();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSourceImageBorderSize = () => formatterPageComponent.onUpdateSourceImageBorderSize();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSourceTileBorderSize = () => formatterPageComponent.onUpdateSourceTileBorderSize();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateOutputImageBorderSize = () => formatterPageComponent.onUpdateOutputImageBorderSize();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateOutputTileBorderSize = () => formatterPageComponent.onUpdateOutputTileBorderSize();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onToggleGodotSquareGrid = () => formatterPageComponent.onToggleGodotSquareGrid();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateGodotTileOriginOffset = () => formatterPageComponent.onUpdateGodotTileOriginOffset();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateBgColor = () => formatterPageComponent.onUpdateBgColor();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateBgAlpha = () => formatterPageComponent.onUpdateBgAlpha();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onToggleRenderTileIds = () => formatterPageComponent.onToggleRenderTileIds();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onProcessImage = () => formatterPageComponent.onProcessImage();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateInputTileSet = () => formatterPageComponent.onUpdateInputTileSet();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateOutputTileSet = () => formatterPageComponent.onUpdateOutputTileSet();
// ================================================================= //
// Global Functions
function onLoad() {
    console.log('// ================= onLoad() - Main ==================== //');
}
