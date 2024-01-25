import { TileSetStr } from '../classes/TileSetStr.model.js';
import { arrToSrtArr } from './data.mod.js';

export const TILE_SETS_EXTRA_BASE: TileSetStr[] = [
  {
    name: 'dune-cliffs',
    set: [
      [28, 112, 247, 223, '124', '124_a', '124_b', '31', '241'],
      [7, 193, 253, 127, '199', '199_a', '199_b', '31_a', '241_a'],
      [30, 240, 60, 120, 255, 119, 221, '31_b', '241_b'],
      [15, 225, 135, 195, '199', '199_a', '199_b', 112, 7],
    ].map(arrToSrtArr),
  },
  {
    name: 'DDD (WIP)',
    set: [
      [28, 124, 112, 16, 20, 92, 116, 80],
      [31, 255, 241, 17],
      [7, 199, 193, 1],
      [0, 4, 68, 64, 0],
    ].map(arrToSrtArr),
  },
];
