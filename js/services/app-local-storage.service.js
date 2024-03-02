import { DEFAULT_APP_SETTINGS, } from '../classes/settings.model.js';
import { TileSets } from '../classes/TileSets.model.js';
import { DEFAULT_TILE_SETS } from '../data/tile-set_default.data.js';
import { LocalStorageService } from './local-storage.service.js';
export class AppLocalStorageService {
    APP_PREFIX = 'tile-format';
    STORAGE_KEY_TILE_SETS = `${this.APP_PREFIX}-tile-sets`;
    STORAGE_KEY_SETTINGS = `${this.APP_PREFIX}-app-settings`;
    tileSets = new LocalStorageService(this.STORAGE_KEY_TILE_SETS);
    imageSettings = new LocalStorageService(this.STORAGE_KEY_SETTINGS);
    saveTileSets(tileSets) {
        this.tileSets.save(tileSets.toJson());
    }
    loadTileSets() {
        return this.tileSets.exists()
            ? TileSets.getTileSetsFromJson(this.tileSets.load())
            : DEFAULT_TILE_SETS;
    }
    clearTileSets() {
        this.tileSets.clear();
    }
    saveAppSettings(settings) {
        this.imageSettings.save(JSON.stringify(settings));
    }
    loadAppSettings() {
        return this.imageSettings.exists()
            ? JSON.parse(this.imageSettings.load())
            : DEFAULT_APP_SETTINGS;
    }
    clearAppSettings() {
        this.imageSettings.clear();
    }
}
