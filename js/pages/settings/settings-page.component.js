import { COLOR_PRESETS, } from '../../classes/settings.model.js';
import { GenericPageComponent } from '../../components/generic-page.component.js';
import { NAV_LINKS } from '../../data/links.data.js';
import { Color } from '../../util/Color.js';
import { SettingsPageHtmlElements } from './settings-page.elements.js';
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
const BIT_MASK_TILE_SIZES = [`32px`, `64px`];
const BIT_MASK_TILE_SIZES_NAME = `Setting_BitMask_TileSize`;
export class SettingsPageComponent extends GenericPageComponent {
    TILE_SET_OPTIONS = this.tileSets.toSelectOptions();
    BIT_MASK_COLOR_PRESET_OPTIONS = [
        { name: 'Custom', value: -1 },
        ...COLOR_PRESETS.map((c, i) => ({
            value: i,
            name: c.id,
        })),
    ];
    constructor() {
        super(new SettingsPageHtmlElements(), NAV_LINKS[2]);
        this.populateTileSelects();
        this.onCancelChanges(false);
    }
    getHdTileSize(hd) {
        return BIT_MASK_TILE_SIZES[hd ? 1 : 0];
    }
    renderBitMaskTileSizeRadioGroup(hd) {
        this.HTML_ELEMENTS.Setting_BitMask_TileSize.innerHTML = '';
        BIT_MASK_TILE_SIZES.map((v) => {
            const radioElement = document.createElement('input');
            radioElement.type = 'radio';
            radioElement.name = BIT_MASK_TILE_SIZES_NAME;
            radioElement.id = `${BIT_MASK_TILE_SIZES_NAME}_${v}`;
            radioElement.className = `btn join-item btn-sm`;
            radioElement.value = v;
            radioElement.ariaLabel = v;
            radioElement.checked = v === this.getHdTileSize(hd);
            radioElement.addEventListener('change', () => this.onSettingChanged());
            this.HTML_ELEMENTS.Setting_BitMask_TileSize.appendChild(radioElement);
        });
    }
    // ============================== Public ================================= //
    onSettingChanged() {
        // TODO: Actually check with local storage if values are changed
        // TODO: Bonus: Add an orange * to changed fields?
        this.HTML_ELEMENTS.Settings_alert_unsaved.classList.remove('hidden');
    }
    onSaveChanges() {
        const settings = this.getSettingsFromHtml();
        this.appLocalStorageService.saveAppSettings(settings);
        this.HTML_ELEMENTS.Settings_alert_unsaved.classList.add('hidden');
    }
    onCancelChanges(prompt = true) {
        if (prompt) {
            const yes = confirm('You have unsaved changes!\nAre you sure you want to clear them?');
            if (!yes)
                return;
        }
        const settings = this.appLocalStorageService.loadAppSettings();
        this.syncStateWithHtml(deepClone(settings));
        this.HTML_ELEMENTS.Settings_alert_unsaved.classList.add('hidden');
    }
    onResetToDefaults() {
        const yes = confirm('Are you sure you want to clear the Settings?');
        if (!yes)
            return;
        this.appLocalStorageService.clearAppSettings();
        this.onCancelChanges(false);
        this.HTML_ELEMENTS.Settings_alert_unsaved.classList.add('hidden');
    }
    onUpdateBitMaskColorsPreset() {
        const presetIdx = Number(this.HTML_ELEMENTS.Setting_BitMask_Colors_Preset.value);
        const preset = COLOR_PRESETS[presetIdx];
        if (preset) {
            this.HTML_ELEMENTS.Setting_BitMask_Background.value =
                preset.background.hex;
            this.HTML_ELEMENTS.Setting_BitMask_BackgroundAlpha.valueAsNumber =
                preset.background.a100;
            this.HTML_ELEMENTS.Setting_BitMask_Color.value = preset.color.hex;
            this.HTML_ELEMENTS.Setting_BitMask_ColorAlpha.valueAsNumber =
                preset.color.a100;
            this.onSettingChanged();
        }
    }
    // ============================== Private ================================= //
    populateTileSelects() {
        this.createHTMLSelectOptions(this.HTML_ELEMENTS.Setting_TileSets_Source, this.TILE_SET_OPTIONS);
        this.createHTMLSelectOptions(this.HTML_ELEMENTS.Setting_TileSets_Output, this.TILE_SET_OPTIONS);
        this.createHTMLSelectOptions(this.HTML_ELEMENTS.Setting_BitMask_Colors_Preset, this.BIT_MASK_COLOR_PRESET_OPTIONS);
    }
    getHdValue() {
        const radioButtons = document.querySelectorAll(`input[name="${BIT_MASK_TILE_SIZES_NAME}"]`);
        for (const e of radioButtons) {
            if (e.checked)
                return e.value === this.getHdTileSize(true);
        }
        return false;
    }
    getSettingsFromHtml() {
        return {
            imageSourceSettings: {
                outerBorderSize: this.HTML_ELEMENTS.Setting_SourceImg_OuterBorder.valueAsNumber,
                tileBorderSize: this.HTML_ELEMENTS.Setting_SourceImg_TileBorder.valueAsNumber,
            },
            tileSets: {
                source: Number(this.HTML_ELEMENTS.Setting_TileSets_Source.value),
                output: Number(this.HTML_ELEMENTS.Setting_TileSets_Output.value),
            },
            renderSettings: {
                renderTileId: this.HTML_ELEMENTS.Setting_Render_TileID.checked,
                background: new Color(this.HTML_ELEMENTS.Setting_Render_Background.value, this.HTML_ELEMENTS.Setting_Render_BackgroundAlpha.valueAsNumber),
                outerBorderSize: this.HTML_ELEMENTS.Setting_Render_OuterBorderSize.valueAsNumber,
                tileBorderSize: this.HTML_ELEMENTS.Setting_Render_TileBorderSize.valueAsNumber,
            },
            bitMaskRenderSettings: {
                fancyBorders: this.HTML_ELEMENTS.Setting_BitMask_FancyBorder.checked,
                color: new Color(this.HTML_ELEMENTS.Setting_BitMask_Color.value, this.HTML_ELEMENTS.Setting_BitMask_ColorAlpha.valueAsNumber),
                background: new Color(this.HTML_ELEMENTS.Setting_BitMask_Background.value, this.HTML_ELEMENTS.Setting_BitMask_BackgroundAlpha.valueAsNumber),
                hd: this.getHdValue(),
            },
        };
    }
    syncStateWithHtml(settings) {
        this.HTML_ELEMENTS.Setting_SourceImg_OuterBorder.valueAsNumber =
            settings.imageSourceSettings.outerBorderSize;
        this.HTML_ELEMENTS.Setting_SourceImg_TileBorder.valueAsNumber =
            settings.imageSourceSettings.tileBorderSize;
        this.HTML_ELEMENTS.Setting_TileSets_Source.value = `${settings.tileSets.source}`;
        this.HTML_ELEMENTS.Setting_TileSets_Output.value = `${settings.tileSets.output}`;
        this.HTML_ELEMENTS.Setting_Render_TileID.checked =
            settings.renderSettings.renderTileId;
        this.HTML_ELEMENTS.Setting_Render_Background.value =
            settings.renderSettings.background.hex;
        this.HTML_ELEMENTS.Setting_Render_BackgroundAlpha.valueAsNumber =
            settings.renderSettings.background.a100;
        this.HTML_ELEMENTS.Setting_Render_OuterBorderSize.valueAsNumber =
            settings.renderSettings.outerBorderSize;
        this.HTML_ELEMENTS.Setting_Render_TileBorderSize.valueAsNumber =
            settings.renderSettings.tileBorderSize;
        this.HTML_ELEMENTS.Setting_BitMask_FancyBorder.checked =
            settings.bitMaskRenderSettings.fancyBorders;
        this.renderBitMaskTileSizeRadioGroup(settings.bitMaskRenderSettings.hd);
        this.HTML_ELEMENTS.Setting_BitMask_Background.value =
            settings.bitMaskRenderSettings.background.hex;
        this.HTML_ELEMENTS.Setting_BitMask_BackgroundAlpha.valueAsNumber =
            settings.bitMaskRenderSettings.background.a100;
        this.HTML_ELEMENTS.Setting_BitMask_Color.value =
            settings.bitMaskRenderSettings.color.hex;
        this.HTML_ELEMENTS.Setting_BitMask_ColorAlpha.valueAsNumber =
            settings.bitMaskRenderSettings.color.a100;
    }
}
