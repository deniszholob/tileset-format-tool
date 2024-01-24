export interface TileSetBase {
  name: string;
  link?: string;
  set: (number | null)[][];
}

export class TileSet implements TileSetBase {
  name: string;
  link?: string;
  /** 2D array of tile IDs corresponding to their binary values
   * @ref: TODO: Add reading material
   */
  set: (number | null)[][]; // TODO: rename to tileIdMatrix?

  numRows: number;
  numCols: number;
  /** Total matrix size */
  size: number;
  /** Number of nun empty(null) tiles */
  tileCount: number;

  public static getTileSetFromJson(jsonString: string): TileSet {
    const tileSetsBase: TileSetBase = JSON.parse(jsonString);
    return new TileSet(tileSetsBase);
  }

  constructor(obj: TileSetBase) {
    this.name = obj.name;
    this.link = obj.link;
    this.set = obj.set;

    this.numRows = this.set.length;
    this.numCols = this.set?.[0].length ?? 0;
    this.size = this.numRows * this.numCols;

    this.tileCount = this.set.flatMap((v) => v).filter((v) => v != null).length;
  }

  public toString(): string {
    return `${this.name} | ${this.numRows}x${this.numCols} - ${this.tileCount} tiles`;
  }
}
