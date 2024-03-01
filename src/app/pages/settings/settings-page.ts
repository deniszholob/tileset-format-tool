import { SettingsPageComponent } from './settings-page.component.js';

console.log('// ==================== settings-page.ts ==================== //');

// ================================================================= //
// State
const settingsPageComponent: SettingsPageComponent =
  new SettingsPageComponent();

// ================================================================= //
// Expose global functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onLoad = onLoad;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onSaveChanges = () => settingsPageComponent.onSaveChanges();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onCancelChanges = () => settingsPageComponent.onCancelChanges();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onResetToDefaults = () =>
  settingsPageComponent.onResetToDefaults();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSourceOuterBorderSize = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSourceTileBorderSize = () =>
  settingsPageComponent.onSettingChanged();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateTileSetsSource = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateTileSetsOutput = () =>
  settingsPageComponent.onSettingChanged();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSettingRenderTileID = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSettingRenderBackground = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSettingRenderBackgroundAlpha = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateRenderOuterBorderSize = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateRenderTileBorderSize = () =>
  settingsPageComponent.onSettingChanged();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSettingBitMaskFancyBorder = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateBitMaskColorsPreset = () =>
  settingsPageComponent.onUpdateBitMaskColorsPreset();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSettingBitMaskBackground = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSettingBitMaskBackgroundAlpha = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSettingBitMaskColor = () =>
  settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).onUpdateSettingBitMaskColorAlpha = () =>
  settingsPageComponent.onSettingChanged();

// ================================================================= //
// Global Functions

function onLoad(): void {
  // console.log('// ================= onLoad() - Settings ================= //');
  // settingsPageComponent = new SettingsPageComponent();
}
