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
    if (sets.length === 0) console.warn('No tile sets provided');
    this.sets = this.getTileSetFromBase(sets);
  }

  private getTileSetFromBase(tileSetsBase: TileSetStr[]): TileSet[] {
    return tileSetsBase
      .filter((s) => !!s)
      .map((tileSetBase: TileSetStr): TileSet => new TileSet(tileSetBase));
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

  public toJson(spacing?: number): string {
    return JSON.stringify(this.sets, null, spacing);
  }

  public toSelectOptions(): SelectOption[] {
    return this.sets.map(
      (v: TileSet, i: number): SelectOption => v.toSelectOption(i),
    );
  }
}
