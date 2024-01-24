import { TileSet } from './TileSet.model.js';
export class TileSets {
    sets;
    get size() {
        return this.sets.length;
    }
    // public name: string;
    static getTileSetsFromJson(jsonString) {
        const tileSetsBase = JSON.parse(jsonString) ?? [];
        return new TileSets(tileSetsBase);
    }
    constructor(sets = []) {
        if (sets.entries.length === 0)
            console.warn('No tile sets provided');
        this.sets = this.getTileSetFromBase(sets);
    }
    getTileSetFromBase(tileSetsBase) {
        return tileSetsBase.map((tileSetBase) => new TileSet(tileSetBase));
    }
    addTileSet(tileSetBase) {
        this.sets.push(new TileSet(tileSetBase));
    }
    addTileSets(tileSetBase) {
        this.sets.push(...this.getTileSetFromBase(tileSetBase));
    }
    removeTileSet(tileSetName) {
        const index = this.sets.findIndex((tileSet) => tileSet.name === tileSetName);
        this.sets.splice(index, 1);
    }
    toJson() {
        const tileSetsBase = this.sets.map((v) => ({
            name: v.name,
            set: v.set,
            link: v.link,
        }));
        return JSON.stringify(tileSetsBase);
    }
    /** TODO: Add Custom Option (Here?) */
    toSelectOptions() {
        return this.sets.map((v, i) => ({
            name: `${i} | ${v.toString()}`,
            value: i,
        }));
    }
}
