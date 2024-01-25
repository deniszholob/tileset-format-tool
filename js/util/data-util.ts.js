import { TileSets } from '../classes/TileSets.model.js';
const LOCAL_STORAGE_KEY = 'tile-sets';
export function saveTileSetsToLocalStorage(tileSets) {
    console.log(`saved: `, tileSets.toJson());
    localStorage.setItem(LOCAL_STORAGE_KEY, tileSets.toJson());
}
export function loadTileSetsToLocalStorage() {
    const tileSetsJson = localStorage.getItem(LOCAL_STORAGE_KEY) ?? '';
    console.log(`loaded: `, JSON.parse(tileSetsJson));
    return TileSets.getTileSetsFromJson(tileSetsJson);
}
export function existSavedTileSets() {
    return Object.prototype.hasOwnProperty.call(localStorage, LOCAL_STORAGE_KEY);
}
export function csvToMatrix(csv) {
    const LINE_DELIMITER = '\n';
    const VALUE_DELIMITER = ',';
    const result = csv
        .split(LINE_DELIMITER)
        .map((row) => row
        .trim()
        .split(VALUE_DELIMITER)
        .map((value) => value.trim()));
    return result;
}
