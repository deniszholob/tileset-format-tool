import { APP_ENV_LOCAL } from '../app-update.js';
import { TileSets } from '../classes/TileSets.model.js';
import { arrToSrtArr } from './data.mod.js';
import { TILE_SETS_EXTRA_BASE } from './tile-set_extra.data.js';
export const DEFAULT_TILE_SETS_BASE = [
    {
        name: 'blob-tilepipe2',
        link: 'https://aleksandrbazhin.itch.io/tilepipe2',
        set: [
            [16, 20, 84, 80, 213, 92, 116, 87, 28, 125, 124, 112],
            [17, 21, 85, 81, 29, 127, 253, 113, 31, 119, -1, 245],
            [1, 5, 69, 65, 23, 223, 247, 209, 95, 255, 221, 241],
            [0, 4, 68, 64, 117, 71, 197, 93, 7, 199, 215, 193],
        ].map(arrToSrtArr),
    },
    {
        name: 'blob-tilesetter',
        link: 'https://www.tilesetter.org/docs/generating_tilesets#blob-sets',
        set: [
            [28, 124, 112, 16, 20, 116, 92, 80, 84, 221, null],
            [31, 255, 241, 17, 23, 247, 223, 209, 215, 119, null],
            [7, 199, 193, 1, 29, 253, 127, 113, 125, 93, 117],
            [4, 68, 64, 0, 5, 197, 71, 65, 69, 87, 213],
            [null, null, null, null, 21, 245, 95, 81, 85, null, null],
        ].map(arrToSrtArr),
    },
    {
        name: 'blob',
        link: 'http://www.squidi.net/three/entry.php?id=166',
        set: [
            [16, 28, 124, 112, 20, 84, 80, 247, 215, 223],
            [17, 31, 255, 241, 21, 0, 81, 245, 85, 95],
            [1, 7, 199, 193, 5, 69, 65, 253, 125, 127],
            [null, 4, 68, 64, 116, 209, 23, 92, 213, 87],
            [-1, null, 221, 119, 29, 71, 197, 113, 117, 93],
        ].map(arrToSrtArr),
    },
    {
        name: 'blob-slime-eevee',
        link: 'https://discourse.mapeditor.org/t/neither-terrain-nor-wang-can-handle-a-blob-tileset/4671',
        set: [
            [28, 124, 112, 16, 20, 92, 116, 80, 213, 84, 87, 215],
            [31, 255, 241, 17, 29, 127, 253, 113, 21, 85, 81, 125],
            [7, 199, 193, 1, 23, 223, 247, 209, 117, 69, 93, 119],
            [4, 68, 64, 0, 5, 71, 197, 65, 245, 95, 221, -1],
        ].map(arrToSrtArr),
    },
    {
        name: 'blob-steampunk',
        link: 'https://opengameart.org/content/steampunk-brick-new-connecting-tileset-16x16',
        set: [
            [0, 4, 68, 64, 20, 80, 21, 84, 87, 93, 245, 215],
            [16, 28, 124, 112, 5, 65, 69, 81, 213, 117, 125, 95],
            [17, 31, 255, 241, 29, 116, 23, 92, 247, 223, 119, 221],
            [1, 7, 199, 193, 71, 209, 197, 113, 253, 127, 85, -1],
        ].map(arrToSrtArr),
    },
    {
        name: 'blob-opengameart',
        link: 'https://opengameart.org/content/seamless-tileset-template',
        set: [
            [20, '68', 84, '68_a', '68_b', 80, '-1', 16],
            ['17', 28, 117, 92, '124', 125, '124_a', 113],
            [21, 87, 193, 23, '199', 223, '255', '241'],
            ['17_a', 29, 116, 93, 112, '31', '255_a', '241_a'],
            ['17_b', '31_a', '241_b', 7, 221, 127, 247, 209],
            [5, 95, 253, '124_b', 119, 215, 213, 81],
            ['-1_a', '31_b', '255_b', '255_c', 245, 85, 65, 1],
            [4, 71, '199_a', '199_b', 197, 69, 64, 0],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-marching-squares',
        link: 'https://www.boristhebrave.com/2013/07/14/tileset-roundup/?q=tutorials/tileset-roundup',
        set: [
            [255, 199, 241, 31],
            [-1, 124, 221, 119],
            [247, 223, 28, 112],
            [253, 127, 7, 193],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-marching-squares-tilepipe2',
        link: 'https://aleksandrbazhin.itch.io/tilepipe2',
        set: [
            [112, 31, 253, 124],
            [221, 127, 255, 247],
            [7, 199, 223, 241],
            [-1, 28, 119, 193],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-marching-squares-tilesetter',
        link: 'https://www.tilesetter.org/docs/generating_tilesets#wang-sets',
        set: [
            [null, 28, 124, 112, 247, 223],
            [-1, 31, 255, 241, 253, 127],
            [null, 7, 199, 193, 221, 119],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-inside/outside',
        link: 'https://gamedev.stackexchange.com/questions/148460/combinations-for-tiling-two-textures-together/148464#148464',
        set: [
            [28, 124, 112, 247, 223],
            [31, 255, 241, 253, 127],
            [7, 199, 193, -1, 0],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-inside/outside-diag',
        set: [
            [28, 124, 112, 247, 223],
            [31, 255, 241, 253, 127],
            [7, 199, 193, 119, 221],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-top',
        set: [
            [223, 255, 247],
            [7, 199, 193],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-inside/outside-lpc-terrain',
        link: 'https://opengameart.org/art-search?keys=lpc+terrain',
        set: [
            [0, 247, 223],
            [0, 253, 127],
            [28, 124, 112],
            [31, '255', 241],
            [7, 199, 193],
            ['255_a', '255_b', '255_c'],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-fence-inside-corners',
        link: 'https://gamedev.stackexchange.com/questions/148460/combinations-for-tiling-two-textures-together/148464#148464',
        set: [
            [16, 20, 84, 80],
            [17, 21, 85, 81],
            [1, 5, 69, 65],
            [0, 4, 68, 64],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-rug-outside-corners',
        link: 'https://gamedev.stackexchange.com/questions/148460/combinations-for-tiling-two-textures-together/148464#148464',
        set: [
            [16, 28, 124, 112],
            [17, 31, 255, 241],
            [1, 7, 199, 193],
            [0, 4, 68, 64],
        ].map(arrToSrtArr),
    },
    {
        name: 'wang-9-slice',
        link: 'https://gamedev.stackexchange.com/questions/148460/combinations-for-tiling-two-textures-together/148464#148464',
        set: [
            [28, 124, 112],
            [31, 255, 241],
            [7, 199, 193],
        ].map(arrToSrtArr),
    },
    {
        name: 'rpg-maker',
        set: [
            [0, 85],
            [28, 112],
            [7, 193],
        ].map(arrToSrtArr),
    },
    {
        name: 'craftpix-top-forest',
        link: 'https://craftpix.net/product/forest-top-down-2d-game-tileset/',
        set: [
            [247, '199', 223, '28', 125, '112', '28_a', '124_a', '112_a'],
            ['241', 0, '31', 95, '255', 245, '31_a', '255_a', '241_a'],
            [253, '124', 127, '7', 215, '193', '7_a', '199_a', '193_a'],
            ['20', 84, '80', 16, 116, 92, '20_a', '68_a', '80_a'],
            [21, 85, 81, '17', 197, 71, '17_a', '-1', '17_b'],
            ['5', 69, '65', 1, '-1_a', '-1_b', '5_a', '68_b', '65_a'],
            [null, null, null, 4, '68', 64, null, null, null],
        ].map(arrToSrtArr),
    },
    {
        name: 'craftpix-side-swamp',
        link: 'https://opengameart.org/content/swamp-2d-tileset-pixel-art',
        set: [
            ['28', '124_a', '112', 247, '199', 223, null, null, null, null],
            ['31', 255, '241', '241_a', -1, '31_a', 95, 215, 119, null],
            [7, '199_a', 193, '253', '124_a', '127', 245, 125, 221, null],
            [0, 4, 68, 64, 85, 29, 21, 23, null, null],
            [92, 84, 116, 209, 81, 113, '28_a', '112_a', null, null],
            [71, 69, 197, 16, 17, 1, '127_a', '253_a', null, null],
        ].map(arrToSrtArr),
    },
    {
        name: 'kenney-roads',
        link: 'https://kenney.nl/assets/road-textures',
        set: [
            [17, '20', '80', '28', '112', '20_a', '80_a', '28_a', '112_a', 85, '247', '223'],
            [68, '5', '65', '7', '193', '5_a', '65_a', '7_a', '193_a', 221, '253', '127'],
            [-1, null, 31, 241, 21, 81, 245, 95, 16, 1, '247_a', '223_a'],
            [null, 255, 199, 124, 69, 84, 125, 215, 4, 64, '253_a', '127_a'],
        ].map(arrToSrtArr),
    },
    {
        name: 'mystic-woods',
        link: 'https://game-endeavor.itch.io/mystic-woods',
        set: [
            [16, 28, 124, 112, 247, 223],
            [17, 31, 255, 241, 253, 127],
            [1, 7, 199, 193, 119, 221],
            [0, 4, 68, 64, null, null],
        ].map(arrToSrtArr),
    },
    {
        name: 'dev-worm',
        link: 'https://devworm.itch.io/survival-game-godot-4-series-art',
        set: [
            [16, 20, 84, 80, 93, 125, 117, 28, 124, 112, 127, 253],
            [17, 21, 85, 81, 95, '255', 245, 31, '255_a', 241, 223, 247],
            [1, 5, 69, 65, 87, 215, 213, 7, 199, 193, 221, 119],
            [0, 4, 68, 64, 92, 116, 71, 197, 29, 113, 23, 209],
        ].map(arrToSrtArr),
    },
    {
        name: 'bit-mask-256-tiles-square',
        set: [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
            [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63],
            [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
            [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95],
            [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111],
            [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127],
            [128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143],
            [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159],
            [160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175],
            [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191],
            [192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207],
            [208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223],
            [224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239],
            [240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255],
        ].map(arrToSrtArr),
    },
];
const DEFAULT_TILE_SETS_ENV = [...DEFAULT_TILE_SETS_BASE];
if (APP_ENV_LOCAL)
    DEFAULT_TILE_SETS_ENV.push(...TILE_SETS_EXTRA_BASE);
export const DEFAULT_TILE_SETS = new TileSets(DEFAULT_TILE_SETS_ENV);
// export const DEFAULT_TILE_SETS: TileSets = new TileSets(TILE_SETS_TEST_Base);
