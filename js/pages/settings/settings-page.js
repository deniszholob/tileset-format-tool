import { SettingsPageComponent } from './settings-page.component.js';
console.log('// ==================== settings-page.ts ==================== //');
// ================================================================= //
// State
const settingsPageComponent = new SettingsPageComponent();
// ================================================================= //
// Expose global functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onLoad = onLoad;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onSaveChanges = () => settingsPageComponent.onSaveChanges();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onCancelChanges = () => settingsPageComponent.onCancelChanges();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onResetToDefaults = () => settingsPageComponent.onResetToDefaults();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSourceOuterBorderSize = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSourceTileBorderSize = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateTileSetsSource = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateTileSetsOutput = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSettingRenderTileID = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSettingRenderBackground = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSettingRenderBackgroundAlpha = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateRenderOuterBorderSize = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateRenderTileBorderSize = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSettingBitMaskFancyBorder = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateBitMaskColorsPreset = () => settingsPageComponent.onUpdateBitMaskColorsPreset();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSettingBitMaskBackground = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSettingBitMaskBackgroundAlpha = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSettingBitMaskColor = () => settingsPageComponent.onSettingChanged();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.onUpdateSettingBitMaskColorAlpha = () => settingsPageComponent.onSettingChanged();
// ================================================================= //
// Global Functions
function onLoad() {
    // console.log('// ================= onLoad() - Settings ================= //');
    // settingsPageComponent = new SettingsPageComponent();
}
