import { Tile } from './Tile.model.js';
export class TileSet {
    name;
    link;
    /** 2D array of tile IDs corresponding to their binary values
     * @ref: TODO: Add reading material
     */
    set; // TODO: rename to tileIdMatrix?
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
        this.set = obj.set.map((row) => row.map((tile) => Tile.getTileFromString(tile)));
        this.numRows = this.set.length;
        this.numCols = this.set?.[0].length ?? 0;
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
}
