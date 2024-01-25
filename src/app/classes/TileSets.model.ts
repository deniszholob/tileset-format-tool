import { SelectOption } from './SelectOption.model.js';
import { TileSet } from './TileSet.model.js';
import { TileSetStr } from './TileSetStr.model.js';

export class TileSets {
  public sets: TileSet[];
  public get size(): number {
    return this.sets.length;
  }
  // public name: string;

  public static getTileSetsFromJson(jsonString: string): TileSets {
    const tileSetsBase: TileSetStr[] = JSON.parse(jsonString) ?? [];
    return new TileSets(tileSetsBase);
  }

  constructor(sets: TileSetStr[] = []) {
    if (sets.entries.length === 0) console.warn('No tile sets provided');
    this.sets = this.getTileSetFromBase(sets);
  }

  private getTileSetFromBase(tileSetsBase: TileSetStr[]): TileSet[] {
    return tileSetsBase.map(
      (tileSetBase: TileSetStr) => new TileSet(tileSetBase),
    );
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

  public toJson(): string {
    const tileSetsJson: string[] = this.sets.map((v) => v.toJson());
    return JSON.stringify(tileSetsJson);
  }

  /** TODO: Add Custom Option (Not Here?) */
  public toSelectOptions(): SelectOption[] {
    return this.sets.map((v, i) => ({
      name: `${i} | ${v.toString()}`,
      value: i,
    }));
  }
}
