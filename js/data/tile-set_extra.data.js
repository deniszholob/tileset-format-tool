import { arrToSrtArr } from './data.mod.js';
export const TILE_SETS_EXTRA_BASE = [
    {
        name: 'dune-cliffs',
        set: [
            [28, '112', 247, 223, '124', '124_a', '124_b', '31', '241'],
            ['7', 193, 253, 127, '199', '199_a', '199_b', '31_a', '241_a'],
            [30, 240, 60, 120, 255, 119, 221, '31_b', '241_b'],
            [15, 225, 135, 195, '199_c', '199_d', '199_e', '112_a', '7_a'],
        ].map(arrToSrtArr),
    },
    {
        name: 'DDD (WIP)',
        set: [
            ['28', '124', '112', 247, '199_a', 223, '28_a', 125, '112_a'],
            [31, 255, '241', '241_a', -1, '31_a', 95, '255_a', 245],
            ['7', 199, '193', 253, '124_a', 127, '7_a', 215, '193_a'],
            [20, 84, 80, 16, 213, 92, 116, 87],
            [21, 85, 81, 17, 29, 119, 221, 113],
            [5, 69, 65, 1, 23, '', '', 209],
            [4, 68, 64, 0, 117, 71, 197, 93],
        ].map(arrToSrtArr),
    },
    {
        name: 'blob_DDD',
        set: [
            [28, 124, 112, 247, 215, 223, 119, 221],
            [31, 255, 241, 245, -1, 95, 116, 92],
            [7, 199, 193, 253, 125, 127, 197, 71],
            [20, 84, 80, 16, 23, 209, 213, 87],
            [21, 85, 81, 17, 29, 113, 117, 93],
            [5, 69, 65, 1, 0, 4, 68, 64],
        ].map(arrToSrtArr),
    },
    {
        name: 'blob_DDD2-eeveemod',
        set: [
            [28, 124, 112, 16, 20, 92, 116, 80, 213, 84, 87, 215],
            [31, 255, 241, 17, 29, 127, 253, 113, 21, 85, 81, 125],
            [7, 199, 193, 1, 23, 223, 247, 209, 117, 69, 93, 119],
            [4, 68, 64, 0, 5, 71, 197, 65, 245, 95, 221, -1],
        ].map(arrToSrtArr),
    },
    {
        name: `kenney_road_DDD`,
        set: [
            [28, 112, 247, 223, 20, 80, 255, 245, 68, 95, 213, 92, 116, 87],
            [7, 193, 253, 127, 5, 65, 215, 4, 84, 16, 29, 119, 221, 113],
            ['28_a', '112_a', '247_a', '223_a', '20_a', '80_a', 17, 21, 85, 81, 23, 0, -1, 209],
            ['7_a', '193_a', '253_a', '127_a', '5_a', '65_a', 125, 1, 69, 64, 117, 71, 197, 93],
        ].map(arrToSrtArr),
    },
    {
        name: `blob_DDD-keeneymod`,
        set: [
            [28, 112, 215, 4, 84, 16, 213, 92, 116, 87, 221],
            [7, 193, 17, 21, 85, 81, 29, 247, 223, 113, 119],
            [20, 80, 125, 1, 69, 64, 23, 253, 127, 209, 0],
            [5, 65, 255, 245, 68, 95, 117, 71, 197, 93, -1],
        ].map(arrToSrtArr),
    },
];
