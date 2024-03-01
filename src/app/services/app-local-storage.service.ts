import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
} from '../classes/settings.model.js';
import { TileSets } from '../classes/TileSets.model.js';
import { DEFAULT_TILE_SETS } from '../data/tile-set_default.data.js';
import { LocalStorageService } from './local-storage.service.js';

export class AppLocalStorageService {
  private readonly APP_PREFIX: string = 'tile-format';
  private readonly STORAGE_KEY_TILE_SETS: string = `${this.APP_PREFIX}-tile-sets`;
  private readonly STORAGE_KEY_SETTINGS: string = `${this.APP_PREFIX}-app-settings`;

  private readonly tileSets: LocalStorageService = new LocalStorageService(
    this.STORAGE_KEY_TILE_SETS,
  );
  private readonly imageSettings: LocalStorageService = new LocalStorageService(
    this.STORAGE_KEY_SETTINGS,
  );

  public saveTileSets(tileSets: TileSets): void {
    this.tileSets.save(tileSets.toJson());
  }
  public loadTileSets(): TileSets {
    return this.tileSets.exists()
      ? TileSets.getTileSetsFromJson(this.tileSets.load())
      : DEFAULT_TILE_SETS;
  }
  public clearTileSets(): void {
    this.tileSets.clear();
  }

  public saveAppSettings(settings: AppSettings): void {
    this.imageSettings.save(JSON.stringify(settings));
  }
  public loadAppSettings(): AppSettings {
    return this.imageSettings.exists()
      ? JSON.parse(this.imageSettings.load())
      : DEFAULT_APP_SETTINGS;
  }
  public clearAppSettings(): void {
    this.imageSettings.clear();
  }
}
