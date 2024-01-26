import { TileSets } from '../classes/TileSets.model.js';
const LOCAL_STORAGE_KEY = 'tile-sets';
export function saveTileSetsToLocalStorage(tileSets) {
    console.log(`Saved to local storage: `, tileSets.toJson());
    localStorage.setItem(LOCAL_STORAGE_KEY, tileSets.toJson());
}
export function loadTileSetsFromLocalStorage() {
    const tileSetsJson = localStorage.getItem(LOCAL_STORAGE_KEY) ?? '';
    console.log(`Loaded from local storage: `, JSON.parse(tileSetsJson));
    return TileSets.getTileSetsFromJson(tileSetsJson);
}
export function existSavedTileSets() {
    return Object.prototype.hasOwnProperty.call(localStorage, LOCAL_STORAGE_KEY);
}
export function clearTileSetsFromLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
}
// ------------------------------------------------------------------ //
const LINE_DELIMITER = '\n';
const VALUE_DELIMITER = ',';
export function csvToMatrix(csv) {
    const result = csv
        .split(LINE_DELIMITER)
        .map((row) => row
        .trim()
        .split(VALUE_DELIMITER)
        .map((value) => value.trim()));
    return result;
}
export function matrixToCsv(matrix, mapper) {
    return matrix
        .map((row) => row.map(mapper).join(VALUE_DELIMITER))
        .join(LINE_DELIMITER);
}
// ------------------------------------------------------------------ //
/** https://stackoverflow.com/a/30800715 */
export function downloadJSONtoFile(json, fileName) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);
    const elDownload = document.createElement('a');
    elDownload.setAttribute('href', dataStr);
    elDownload.setAttribute('download', fileName + '.json');
    document.body.appendChild(elDownload);
    elDownload.click();
    elDownload.remove();
}
export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
