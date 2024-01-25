import { TileSets } from '../classes/TileSets.model.js';
import { arrToSrtArr } from './data.mod.js';
export const TILE_SETS_TEST_Base = [
    {
        name: 'Test2',
        set: [[1, 1], [2]].map(arrToSrtArr),
    },
    {
        name: 'Test',
        set: [[1, '1_a'], [2]].map(arrToSrtArr),
    },
];
export const TILE_SETS_TEST = new TileSets(TILE_SETS_TEST_Base);
