import { FormatterPageComponent } from './formatter-page.component.js';

// ================================================================= //
// State
const formatterPageComponent: FormatterPageComponent =
  new FormatterPageComponent();

// ================================================================= //
// Expose global functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onLoad = onLoad;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onImageUpload = () => formatterPageComponent.onImageUpload();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSourceImageBorderSize = () =>
  formatterPageComponent.onUpdateSourceImageBorderSize();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSourceTileBorderSize = () =>
  formatterPageComponent.onUpdateSourceTileBorderSize();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateOutputImageBorderSize = () =>
  formatterPageComponent.onUpdateOutputImageBorderSize();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateOutputTileBorderSize = () =>
  formatterPageComponent.onUpdateOutputTileBorderSize();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onToggleGodotSquareGrid = () =>
  formatterPageComponent.onToggleGodotSquareGrid();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateGodotTileOriginOffset = () =>
  formatterPageComponent.onUpdateGodotTileOriginOffset();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateBgColor = () =>
  formatterPageComponent.onUpdateBgColor();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateBgAlpha = () =>
  formatterPageComponent.onUpdateBgAlpha();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onToggleRenderTileIds = () =>
  formatterPageComponent.onToggleRenderTileIds();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onProcessImage = () => formatterPageComponent.onProcessImage();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateInputTileSet = () =>
  formatterPageComponent.onUpdateInputTileSet();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateOutputTileSet = () =>
  formatterPageComponent.onUpdateOutputTileSet();

// ================================================================= //
// Global Functions

function onLoad(): void {
  console.log('// ================= onLoad() - Main ==================== //');
}
