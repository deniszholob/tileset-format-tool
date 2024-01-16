interface TileSetBase {
  name: string;
  link: string;
  set: (number | null)[][];
}

export class TileSet implements TileSetBase {
  name: string;
  link: string;
  /** 2D array of tile IDs corresponding to their binary values
   * @ref: TODO: Add reading material
   */
  set: (number | null)[][]; // TODO: rename to tileIdMatrix?

  numRows: number;
  numCols: number;
  size: number;
  tileCount: number;

  constructor(obj: TileSetBase) {
    this.name = obj.name;
    this.link = obj.link;
    this.set = obj.set;

    this.numRows = this.set.length;
    this.numCols = this.set?.[0].length ?? 0;
    this.size = this.numRows * this.numCols;

    this.tileCount = this.set.flatMap((v) => v).filter((v) => v != null).length;
  }
}

export const TILE_SETS: TileSet[] = [
  new TileSet({
    name: 'blob-steampunk',
    link: 'hhttps://opengameart.org/content/steampunk-brick-new-connecting-tileset-16x16',
    set: [
      [0, 4, 68, 64, 20, 80, 21, 84, 87, 93, 245, 215],
      [16, 28, 124, 112, 5, 65, 69, 81, 213, 117, 125, 95],
      [17, 31, 255, 241, 29, 116, 23, 92, 247, 223, 119, 221],
      [1, 7, 199, 193, 71, 209, 197, 113, 253, 127, 85, -255],
    ],
  }),
  new TileSet({
    name: 'blob-set-47-tilepipe2',
    link: 'https://aleksandrbazhin.itch.io/tilepipe2',
    set: [
      [16, 20, 84, 80, 213, 92, 116, 87, 28, 125, 124, 112],
      [17, 21, 85, 81, 29, 127, 253, 113, 31, 119, -255, 245],
      [1, 5, 69, 65, 23, 223, 247, 209, 95, 255, 221, 241],
      [0, 4, 68, 64, 117, 71, 197, 93, 7, 199, 215, 193],
    ],
  }),
  new TileSet({
    name: 'blob-set-47-tilesetter',
    link: 'https://www.tilesetter.org/docs/generating_tilesets#blob-sets',
    set: [
      [28, 124, 112, 16, 20, 116, 92, 80, 84, 221, null],
      [31, 255, 241, 17, 23, 247, 223, 209, 215, 119, null],
      [7, 199, 193, 1, 29, 253, 127, 113, 125, 93, 117],
      [4, 68, 64, 0, 5, 197, 71, 65, 69, 87, 213],
      [null, null, null, null, 21, 245, 95, 81, 85, null, null],
    ],
  }),
  new TileSet({
    name: 'wang-set-16-tilepipe',
    link: 'https://aleksandrbazhin.itch.io/tilepipe2',
    set: [
      [112, 31, 253, 124],
      [221, 127, 255, 247],
      [7, 199, 223, 241],
      [-255, 28, 119, 193],
    ],
  }),
  new TileSet({
    name: 'wang-set-16-tilesetter',
    link: 'https://www.tilesetter.org/docs/generating_tilesets#wang-sets',
    set: [
      [null, 28, 124, 112, 247, 223],
      [-255, 31, 255, 241, 253, 127],
      [null, 7, 199, 193, 221, 119],
    ],
  }),
  new TileSet({
    name: 'wang-set-16-marching-squares',
    link: 'https://www.boristhebrave.com/2013/07/14/tileset-roundup/?q=tutorials/tileset-roundup',
    set: [
      [255, 199, 241, 31],
      [-255, 124, 221, 119],
      [247, 223, 28, 112],
      [253, 127, 7, 193],
    ],
  }),
  new TileSet({
    name: '6-rpg-maker',
    link: 'https://aleksandrbazhin.itch.io/tilepipe2',
    set: [
      [0, 85],
      [28, 112],
      [7, 193],
    ],
  }),
  new TileSet({
    name: 'wang-blob-set-opengameart',
    link: 'https://opengameart.org/content/seamless-tileset-template',
    set: [
      [20, 68, 84, 68, 68, 80, -255, 16],
      [17, 28, 117, 92, 124, 125, 124, 113],
      [21, 87, 193, 23, 199, 223, 255, 241],
      [17, 29, 116, 93, 112, 31, 255, 241],
      [17, 31, 241, 7, 221, 127, 247, 209],
      [5, 95, 253, 124, 119, 215, 213, 81],
      [-255, 31, 255, 255, 245, 85, 65, 1],
      [4, 71, 199, 199, 197, 69, 64, 0],
    ],
  }),
  new TileSet({
    name: 'lpc-terrain',
    link: 'hhttps://opengameart.org/',
    set: [
      [0, 247, 223],
      [0, 253, 127],
      [28, 124, 112],
      [31, 225, 241],
      [7, 199, 193],
      [255, 255, 255],
    ],
  }),
];

export interface SelectOption {
  name: string;
  value: number;
}

export const TILE_SET_OPTIONS: SelectOption[] = TILE_SETS.map((v, i) => ({
  name: `${i} | ${v.name}`,
  value: i,
}));
