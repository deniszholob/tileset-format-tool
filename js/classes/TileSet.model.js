import { matrixToCsv } from '../util/data-util.ts.js';
import { Tile } from './Tile.model.js';
export class TileSet {
    name;
    link;
    set;
    numRows;
    numCols;
    /** Total matrix size */
    size;
    /** Number of nun empty(null) tiles */
    tileCount;
    static getTileSetFromJson(jsonString) {
        const tileSetsBase = JSON.parse(jsonString);
        return new TileSet(tileSetsBase);
    }
    constructor(obj) {
        this.name = obj.name;
        this.link = obj.link;
        this.set = obj.set.map((row) => row.map((tile) => !tile
            ? undefined
            : typeof tile === 'string'
                ? Tile.getTileFromString(tile)
                : new Tile(tile.id, tile.variant)));
        this.numRows = this.set.length;
        this.numCols = this.set
            .map((t) => t.length)
            .reduce((acc, curr) => Math.max(acc, curr), 0);
        this.size = this.numRows * this.numCols;
        this.tileCount = this.set.flatMap((v) => v).filter((v) => v != null).length;
    }
    toString() {
        return `${this.name} | ${this.numRows}x${this.numCols} - ${this.tileCount} tiles`;
    }
    toTileSetBase() {
        return {
            name: this.name,
            link: this.link,
            set: this.set.map((row) => row.map((tile) => tile?.toString() ?? '')),
        };
    }
    toJson() {
        return JSON.stringify(this.toTileSetBase());
    }
    toSetCSV() {
        return matrixToCsv(this.set, (tile) => tile?.toString() ?? '');
    }
    toSelectOption(i) {
        return {
            name: `${i} | ${this.toString()}`,
            value: i,
        };
    }
}
