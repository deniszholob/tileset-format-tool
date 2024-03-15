/** 8-bit Directional Values of a bitmask sum up to a number between 0 and 255.
 * @ref https://code.tutsplus.com/how-to-use-tile-bitmasking-to-auto-tile-your-level-layouts--cms-25673t
 * @ref https://aleksandrbazhin.itch.io/tilepipe2
 */
class GodotBitmask {
    /** 2^0 = 1 */
    top_center = false;
    /** 2^1 = 2 */
    top_right = false;
    /** 2^2 = 4 */
    right_center = false;
    /** 2^3 = 8 */
    bottom_right = false;
    /** 2^4 = 16 */
    bottom_center = false;
    /** 2^5 = 32 */
    bottom_left = false;
    /** 2^6 = 64 */
    left_center = false;
    /** 2^7 = 128 */
    top_left = false;
    /** @terrain is always true for 0-255 otherwise it and everything else is false */
    terrain = false;
    /**
     * Constructs a new GodotBitmask object based on the provided bitmask value.
     * @param n The bitmask value between 0 and 255.
     */
    constructor(n) {
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
export class GodotTresData {
    tileTextureSize;
    tileTextureFileName;
    tileTextureFileExt;
    tileTextureTiles = [];
    tileTextureFileUri = '';
    constructor(tileTextureSize, tileTextureFileName, tileTextureFileExt, tileSet) {
        this.tileTextureSize = tileTextureSize;
        this.tileTextureFileName = tileTextureFileName;
        this.tileTextureFileExt = tileTextureFileExt;
        const tileSetName = `_${tileSet.name}`;
        this.tileTextureFileName = this.tileTextureFileName.replace(tileSetName, '');
        this.tileTextureFileName += tileSetName;
        this.tileTextureFileUri += `${this.tileTextureFileName}_TileSet.tres`;
        console.log(this.tileTextureFileName);
        console.log(this.tileTextureFileUri);
        for (let r = 0; r < tileSet.numRows; r++) {
            for (let c = 0; c < tileSet.numCols; c++) {
                this.tileTextureTiles.push({
                    colIdx: c,
                    rowIdx: r,
                    bitmask: new GodotBitmask(tileSet.set[r][c]?.id ?? -1),
                });
            }
        }
    }
    toTres() {
        let output = `[gd_resource type="TileSet" load_steps=3 format=3]

[ext_resource type="Texture2D" path="res://{{tileTextureFileName}}.{{tileTextureFileExt}}" id="1_{{tileTextureFileName}}"]

[sub_resource type="TileSetAtlasSource" id="TileSetAtlasSource_{{tileTextureFileName}}"]
texture = ExtResource("1_{{tileTextureFileName}}")
texture_region_size = Vector2i({{tileTextureSize}}, {{tileTextureSize}})
{{#tileTextureTiles}} {{/tileTextureTiles}}
[resource]
tile_size = Vector2i({{tileTextureSize}}, {{tileTextureSize}})
terrain_set_0/mode = 0
terrain_set_0/terrain_0/name = "Terrain 0"
terrain_set_0/terrain_0/color = Color(0.5, 0.34375, 0.25, 1)
sources/1 = SubResource("TileSetAtlasSource_{{tileTextureFileName}}")
`;
        let tileTextureTilesSrt = ``;
        this.tileTextureTiles.forEach((tile) => {
            tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0 = 0\n`;
            tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrain_set = 0\n`;
            if (tile.bitmask.terrain) {
                tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrain = 0\n`;
            }
            if (tile.bitmask.top_center) {
                tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/top_side = 0\n`;
            }
            if (tile.bitmask.top_right) {
                tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/top_right_corner = 0\n`;
            }
            if (tile.bitmask.right_center) {
                tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/right_side = 0\n`;
            }
            if (tile.bitmask.bottom_right) {
                tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/bottom_right_corner  = 0\n`;
            }
            if (tile.bitmask.bottom_center) {
                tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/bottom_side = 0\n`;
            }
            if (tile.bitmask.bottom_left) {
                tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/bottom_left_corner  = 0\n`;
            }
            if (tile.bitmask.left_center) {
                tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/left_side = 0\n`;
            }
            if (tile.bitmask.top_left) {
                tileTextureTilesSrt += `${tile.colIdx}:${tile.rowIdx}/0/terrains_peering_bit/top_left_corner  = 0\n`;
            }
            // tileTextureTilesSrt += `\n`;
        });
        output = output.replace(`{{#tileTextureTiles}} {{/tileTextureTiles}}`, tileTextureTilesSrt);
        output = output.replaceAll(`{{tileTextureFileName}}`, this.tileTextureFileName);
        output = output.replaceAll(`{{tileTextureFileExt}}`, this.tileTextureFileExt);
        output = output.replaceAll(`{{tileTextureSize}}`, `${this.tileTextureSize}`);
        return output;
    }
}
