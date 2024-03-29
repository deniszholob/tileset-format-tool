import { CSVConverter } from '../util/CSVConverter.js';
import { SelectOption } from './SelectOption.model.js';
import { Tile } from './Tile.model.js';
import { TileSetStr } from './TileSetStr.model.js';

export interface ITileSet {
  name: string;
  link?: string;
  /** 2D array of tile IDs corresponding to their binary values
   * @ref: TODO: Add reading material
   */
  set: (Tile | undefined)[][]; // TODO: rename to tileIdMatrix?
}

export class TileSet implements ITileSet {
  name: string;
  link?: string;
  set: (Tile | undefined)[][];

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

  constructor(obj: TileSetStr | ITileSet) {
    this.name = obj.name;
    this.link = obj.link;
    this.set = obj.set.map(
      (row: string[] | (Tile | undefined)[]): (Tile | undefined)[] =>
        row.map((tile: string | Tile | undefined): Tile | undefined =>
          !tile
            ? undefined
            : typeof tile === 'string'
              ? Tile.getTileFromString(tile)
              : new Tile(tile.id, tile.variant),
        ),
    );

    this.numRows = this.set.length;
    this.numCols = this.set
      .map((t: (Tile | undefined)[]): number => t.length)
      .reduce((acc: number, curr: number): number => Math.max(acc, curr), 0);
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

  public toSetCSV(): string {
    return CSVConverter.matrixToCsv(
      this.set,
      (tile: Tile | undefined): string => tile?.toString() ?? '',
    );
  }

  public toSelectOption(i: number): SelectOption {
    return {
      name: `${i} | ${this.toString()}`,
      value: i,
    };
  }
}
