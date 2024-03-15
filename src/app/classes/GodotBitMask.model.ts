import { Tile } from './Tile.model';
import { TileSet } from './TileSet.model';

/** 8-bit Directional Values of a bitmask sum up to a number between 0 and 255.
 * @ref https://code.tutsplus.com/how-to-use-tile-bitmasking-to-auto-tile-your-level-layouts--cms-25673t
 * @ref https://aleksandrbazhin.itch.io/tilepipe2
 */
class GodotBitmask {
  /** 2^0 = 1 */
  top_center: boolean = false;
  /** 2^1 = 2 */
  top_right: boolean = false;
  /** 2^2 = 4 */
  right_center: boolean = false;
  /** 2^3 = 8 */
  bottom_right: boolean = false;
  /** 2^4 = 16 */
  bottom_center: boolean = false;
  /** 2^5 = 32 */
  bottom_left: boolean = false;
  /** 2^6 = 64 */
  left_center: boolean = false;
  /** 2^7 = 128 */
  top_left: boolean = false;
  /** @terrain is always true for 0-255 otherwise it and everything else is false */
  terrain: boolean = false;

  /**
   * Constructs a new GodotBitmask object based on the provided bitmask value.
   * @param n The bitmask value between 0 and 255.
   */
  constructor(n: number) {
    if (n >= 0 && n <= 255) {
      this.top_center = (n & 1) === 1;
      this.top_right = (n & 2) === 2;
      this.right_center = (n & 4) === 4;
      this.bottom_right = (n & 8) === 8;
      this.bottom_center = (n & 16) === 16;
      this.bottom_left = (n & 32) === 32;
      this.left_center = (n & 64) === 64;
      this.top_left = (n & 128) === 128;
      this.terrain = true;
    }
  }
}

interface GodotTresDataI {
  tileTextureFileName: string;
  tileTextureFileExt: string;
  tileTextureSize: number;
  tileTextureTiles: Array<GodotTresDataTileI | undefined>;
}

interface GodotTresDataTileI {
  colIdx: number;
  rowIdx: number;
  bitmask: GodotBitmask;
}

export class GodotTresData implements GodotTresDataI {
  public tileTextureTiles: Array<GodotTresDataTileI | undefined> = [];
  public tileTextureFileUri: string = '';

  constructor(
    public tileTextureSize: number,
    public tileTextureFileName: string,
    public tileTextureFileExt: string,
    tileSet: TileSet,
  ) {
    const tileSetName: string = `_${tileSet.name}`;
    this.tileTextureFileName = this.tileTextureFileName.replace(
      tileSetName,
      '',
    );
    this.tileTextureFileName += tileSetName;
    this.tileTextureFileUri += `${this.tileTextureFileName}_TileSet.tres`;

    for (let r: number = 0; r < tileSet.numRows; r++) {
      for (let c: number = 0; c < tileSet.numCols; c++) {
        const tileSetTile: Tile | undefined = tileSet.set[r][c];
        const tileTextureTile: GodotTresDataTileI | undefined = tileSetTile
          ? {
              colIdx: c,
              rowIdx: r,
              bitmask: new GodotBitmask(tileSetTile.id),
            }
          : undefined;

        this.tileTextureTiles.push(tileTextureTile);
      }
    }
  }

  private getTresBitmask(tile: GodotTresDataTileI): string {
    let outputTileStr: string = ``;

    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0 = 0\n`;
    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrain_set = 0\n`;

    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrain = ${tile.bitmask.terrain ? 0 : 1}\n`;
    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/right_side = ${tile.bitmask.right_center ? 0 : 1}\n`;
    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/bottom_right_corner = ${tile.bitmask.bottom_right ? 0 : 1}\n`;
    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/bottom_side = ${tile.bitmask.bottom_center ? 0 : 1}\n`;
    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/bottom_left_corner = ${tile.bitmask.bottom_left ? 0 : 1}\n`;
    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/left_side = ${tile.bitmask.left_center ? 0 : 1}\n`;
    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/top_left_corner = ${tile.bitmask.top_left ? 0 : 1}\n`;
    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/top_side = ${tile.bitmask.top_center ? 0 : 1}\n`;
    outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/top_right_corner = ${tile.bitmask.top_right ? 0 : 1}\n`;

    // if (tile.bitmask.terrain) {
    //   outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrain = 0\n`;
    // }
    // if (tile.bitmask.right_center) {
    //   outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/right_side = 0\n`;
    // }
    // if (tile.bitmask.bottom_right) {
    //   outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/bottom_right_corner = 0\n`;
    // }
    // if (tile.bitmask.bottom_center) {
    //   outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/bottom_side = 0\n`;
    // }
    // if (tile.bitmask.bottom_left) {
    //   outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/bottom_left_corner = 0\n`;
    // }
    // if (tile.bitmask.left_center) {
    //   outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/left_side = 0\n`;
    // }
    // if (tile.bitmask.top_left) {
    //   outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/top_left_corner = 0\n`;
    // }
    // if (tile.bitmask.top_center) {
    //   outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/top_side = 0\n`;
    // }
    // if (tile.bitmask.top_right) {
    //   outputTileStr += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/top_right_corner = 0\n`;
    // }

    // tileTextureTilesSrt += `\n`;

    return outputTileStr;
  }

  public toTres(): string {
    let output: string = `[gd_resource type="TileSet" load_steps=3 format=3]

[ext_resource type="Texture2D" path="res://{{tileTextureFileName}}.{{tileTextureFileExt}}" id="1_{{tileTextureFileName}}"]

[sub_resource type="TileSetAtlasSource" id="TileSetAtlasSource_{{tileTextureFileName}}"]
texture = ExtResource("1_{{tileTextureFileName}}")
texture_region_size = Vector2i({{tileTextureSize}}, {{tileTextureSize}})
{{#tileTextureTiles}} {{/tileTextureTiles}}
[resource]
tile_size = Vector2i({{tileTextureSize}}, {{tileTextureSize}})
terrain_set_0/mode = 0
terrain_set_0/terrain_0/name = "Terrain 0"
terrain_set_0/terrain_0/color = Color(0, 0, 0, 1)
terrain_set_0/terrain_1/name = "Terrain 1"
terrain_set_0/terrain_1/color = Color(1, 1, 1, 1)
sources/1 = SubResource("TileSetAtlasSource_{{tileTextureFileName}}")
`;

    let tileTextureTilesSrt: string = ``;

    this.tileTextureTiles
      .filter(
        (t: GodotTresDataTileI | undefined): t is GodotTresDataTileI =>
          t !== undefined,
      )
      .forEach((tile: GodotTresDataTileI): void => {
        tileTextureTilesSrt += this.getTresBitmask(tile);
      });

    output = output.replace(
      `{{#tileTextureTiles}} {{/tileTextureTiles}}`,
      tileTextureTilesSrt,
    );
    output = output.replaceAll(
      `{{tileTextureFileName}}`,
      this.tileTextureFileName,
    );
    output = output.replaceAll(
      `{{tileTextureFileExt}}`,
      this.tileTextureFileExt,
    );
    output = output.replaceAll(
      `{{tileTextureSize}}`,
      `${this.tileTextureSize}`,
    );

    return output;
  }
}
