interface TileSetBase {
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

export const BIT_MASK_TILE_SET: TileSet = new TileSet({
  name: '257-tiles',
  link: 'https://opengameart.org/',
  set: [
    [
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
      38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
      56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
      74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
      92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
      108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
      123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137,
      138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152,
      153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167,
      168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182,
      183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197,
      198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212,
      213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227,
      228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242,
      243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255,
    ],
  ],
});

export const TILE_SETS: TileSet[] = [
  new TileSet({
    name: 'blob-steampunk',
    link: 'https://opengameart.org/content/steampunk-brick-new-connecting-tileset-16x16',
    set: [
      [0, 4, 68, 64, 20, 80, 21, 84, 87, 93, 245, 215],
      [16, 28, 124, 112, 5, 65, 69, 81, 213, 117, 125, 95],
      [17, 31, 255, 241, 29, 116, 23, 92, 247, 223, 119, 221],
      [1, 7, 199, 193, 71, 209, 197, 113, 253, 127, 85, -1],
    ],
  }),
  new TileSet({
    name: 'blob-set-47-tilepipe2',
    link: 'https://aleksandrbazhin.itch.io/tilepipe2',
    set: [
      [16, 20, 84, 80, 213, 92, 116, 87, 28, 125, 124, 112],
      [17, 21, 85, 81, 29, 127, 253, 113, 31, 119, -1, 245],
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
      [-1, 28, 119, 193],
    ],
  }),
  new TileSet({
    name: 'wang-set-16-tilesetter',
    link: 'https://www.tilesetter.org/docs/generating_tilesets#wang-sets',
    set: [
      [null, 28, 124, 112, 247, 223],
      [-1, 31, 255, 241, 253, 127],
      [null, 7, 199, 193, 221, 119],
    ],
  }),
  new TileSet({
    name: 'wang-set-16-marching-squares',
    link: 'https://www.boristhebrave.com/2013/07/14/tileset-roundup/?q=tutorials/tileset-roundup',
    set: [
      [255, 199, 241, 31],
      [-1, 124, 221, 119],
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
      [20, 68, 84, 68, 68, 80, -1, 16],
      [17, 28, 117, 92, 124, 125, 124, 113],
      [21, 87, 193, 23, 199, 223, 255, 241],
      [17, 29, 116, 93, 112, 31, 255, 241],
      [17, 31, 241, 7, 221, 127, 247, 209],
      [5, 95, 253, 124, 119, 215, 213, 81],
      [-1, 31, 255, 255, 245, 85, 65, 1],
      [4, 71, 199, 199, 197, 69, 64, 0],
    ],
  }),
  new TileSet({
    name: 'lpc-terrain',
    link: 'https://opengameart.org/',
    set: [
      [0, 247, 223],
      [0, 253, 127],
      [28, 124, 112],
      [31, 225, 241],
      [7, 199, 193],
      [255, 255, 255],
    ],
  }),
  new TileSet({
    name: '256-tiles-16x16',
    set: [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
      [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63],
      [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
      [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95],
      [
        96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
        111,
      ],
      [
        112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125,
        126, 127,
      ],
      [
        128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141,
        142, 143,
      ],
      [
        144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157,
        158, 159,
      ],
      [
        160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173,
        174, 175,
      ],
      [
        176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189,
        190, 191,
      ],
      [
        192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205,
        206, 207,
      ],
      [
        208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221,
        222, 223,
      ],
      [
        224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237,
        238, 239,
      ],
      [
        240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253,
        254, 255,
      ],
    ],
  }),

  BIT_MASK_TILE_SET,
];

export interface SelectOption {
  name: string;
  value: number;
}

export const TILE_SET_OPTIONS: SelectOption[] = TILE_SETS.map((v, i) => ({
  name: `${i} | ${v.name}`,
  value: i,
}));
