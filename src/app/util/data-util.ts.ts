import { TileSets } from '../classes/TileSets.model.js';

const LOCAL_STORAGE_KEY = 'tile-sets';

export function saveTileSetsToLocalStorage(tileSets: TileSets): void {
  // console.log(`Saved to local storage: `, tileSets.toJson());
  localStorage.setItem(LOCAL_STORAGE_KEY, tileSets.toJson());
}

export function loadTileSetsFromLocalStorage(): TileSets {
  const tileSetsJson: string = localStorage.getItem(LOCAL_STORAGE_KEY) ?? '';
  // console.log(`Loaded from local storage: `, JSON.parse(tileSetsJson));

  return TileSets.getTileSetsFromJson(tileSetsJson);
}

export function existSavedTileSets(): boolean {
  return Object.prototype.hasOwnProperty.call(localStorage, LOCAL_STORAGE_KEY);
}

export function clearTileSetsFromLocalStorage(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

// ------------------------------------------------------------------ //

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** https://stackoverflow.com/a/30800715 */
export function downloadJSONtoFile(json: string, fileName: string): void {
  const dataStr: string =
    'data:text/json;charset=utf-8,' + encodeURIComponent(json);
  const elDownload: HTMLAnchorElement = document.createElement('a');
  elDownload.setAttribute('href', dataStr);
  elDownload.setAttribute('download', fileName + '.json');
  document.body.appendChild(elDownload);
  elDownload.click();
  elDownload.remove();
}

export function setAnchorDownloadDataFile(
  anchor: HTMLAnchorElement,
  data: string,
  fileName: string,
): void {
  const dataStr: string = 'data:text;charset=utf-8,' + encodeURIComponent(data);
  anchor.href = dataStr;
  anchor.download = fileName;
  anchor.classList.remove('hidden');
}
