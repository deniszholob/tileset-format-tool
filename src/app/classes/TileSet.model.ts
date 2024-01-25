import { Tile } from './Tile.model.js';
import { TileSetStr } from './TileSetStr.model.js';

export class TileSet {
  name: string;
  link?: string;
  /** 2D array of tile IDs corresponding to their binary values
   * @ref: TODO: Add reading material
   */
  set: (Tile | undefined)[][]; // TODO: rename to tileIdMatrix?

  numRows: number;
  numCols: number;
  /** Total matrix size */
  size: number;
  /** Number of nun empty(null) tiles */
  tileCount: number;

  public static getTileSetFromJson(jsonString: string): TileSet {
    const tileSetsBase: TileSetStr = JSON.parse(jsonString);
    return new TileSet(tileSetsBase);
  }
  constructor(obj: TileSetStr) {
    this.name = obj.name;
    this.link = obj.link;
    this.set = obj.set.map((row: string[]): (Tile | undefined)[] =>
      row.map((tile: string): Tile | undefined => Tile.getTileFromString(tile)),
    );

    this.numRows = this.set.length;
    this.numCols = this.set?.[0].length ?? 0;
    this.size = this.numRows * this.numCols;

    this.tileCount = this.set.flatMap((v) => v).filter((v) => v != null).length;
  }

  public toString(): string {
    return `${this.name} | ${this.numRows}x${this.numCols} - ${this.tileCount} tiles`;
  }

  public toTileSetBase(): TileSetStr {
    return {
      name: this.name,
      link: this.link,
      set: this.set.map((row: (Tile | undefined)[]): string[] =>
        row.map((tile: Tile | undefined): string => tile?.toString() ?? ''),
      ),
    };
  }

  public toJson(): string {
    return JSON.stringify(this.toTileSetBase());
  }
}
