import { SelectOption } from './SelectOption.model.js';
import { TileSet, TileSetBase } from './TileSet.model.js';

export class TileSets {
  public sets: TileSet[];
  public get size(): number {
    return this.sets.length;
  }
  // public name: string;

  public static getTileSetsFromJson(jsonString: string): TileSets {
    const tileSetsBase: TileSetBase[] = JSON.parse(jsonString) ?? [];
    return new TileSets(tileSetsBase);
  }

  constructor(sets: TileSetBase[] = []) {
    if (sets.entries.length === 0) console.warn('No tile sets provided');
    this.sets = this.getTileSetFromBase(sets);
  }

  private getTileSetFromBase(tileSetsBase: TileSetBase[]): TileSet[] {
    return tileSetsBase.map(
      (tileSetBase: TileSetBase) => new TileSet(tileSetBase),
    );
  }

  public addTileSet(tileSetBase: TileSetBase): void {
    this.sets.push(new TileSet(tileSetBase));
  }

  public addTileSets(tileSetBase: TileSetBase[]): void {
    this.sets.push(...this.getTileSetFromBase(tileSetBase));
  }

  public removeTileSet(tileSetName: string): void {
    const index = this.sets.findIndex(
      (tileSet) => tileSet.name === tileSetName,
    );
    this.sets.splice(index, 1);
  }

  public toJson(): string {
    const tileSetsBase: TileSetBase[] = this.sets.map((v) => ({
      name: v.name,
      set: v.set,
      link: v.link,
    }));
    return JSON.stringify(tileSetsBase);
  }

  /** TODO: Add Custom Option (Here?) */
  public toSelectOptions(): SelectOption[] {
    return this.sets.map((v, i) => ({
      name: `${i} | ${v.toString()}`,
      value: i,
    }));
  }
}
