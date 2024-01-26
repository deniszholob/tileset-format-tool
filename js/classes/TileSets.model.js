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
        if (sets.length === 0)
            console.warn('No tile sets provided');
        this.sets = this.getTileSetFromBase(sets);
    }
    getTileSetFromBase(tileSetsBase) {
        return tileSetsBase
            .filter((s) => !!s)
            .map((tileSetBase) => new TileSet(tileSetBase));
    }
    // public addTileSet(tileSetBase: TileSetBase): void {
    //   this.sets.push(new TileSet(tileSetBase));
    // }
    // public addTileSets(tileSetBase: TileSetBase[]): void {
    //   this.sets.push(...this.getTileSetFromBase(tileSetBase));
    // }
    // public removeTileSet(tileSetName: string): void {
    //   const index = this.sets.findIndex(
    //     (tileSet) => tileSet.name === tileSetName,
    //   );
    //   this.sets.splice(index, 1);
    // }
    toJson(spacing) {
        return JSON.stringify(this.sets, null, spacing);
    }
    toSelectOptions() {
        return this.sets.map((v, i) => v.toSelectOption(i));
    }
}
