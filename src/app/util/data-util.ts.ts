import { TileSets } from '../classes/TileSets.model.js';

const LOCAL_STORAGE_KEY = 'tile-sets';

export function saveTileSetsToLocalStorage(tileSets: TileSets): void {
  console.log(`saved: `, tileSets.toJson());
  localStorage.setItem(LOCAL_STORAGE_KEY, tileSets.toJson());
}

export function loadTileSetsToLocalStorage(): TileSets {
  const tileSetsJson: string = localStorage.getItem(LOCAL_STORAGE_KEY) ?? '';
  console.log(`loaded: `, JSON.parse(tileSetsJson));

  return TileSets.getTileSetsFromJson(tileSetsJson);
}

export function existSavedTileSets(): boolean {
  return Object.prototype.hasOwnProperty.call(localStorage, LOCAL_STORAGE_KEY);
}

export function csvToMatrix(csv: string): string[][] {
  const LINE_DELIMITER = '\n';
  const VALUE_DELIMITER = ',';

  const result: string[][] = csv
    .split(LINE_DELIMITER)
    .map((row: string): string[] =>
      row
        .trim()
        .split(VALUE_DELIMITER)
        .map((value: string): string => value.trim()),
    );
  return result;
}
