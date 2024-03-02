import { Color } from '../util/Color.js';
export const COLOR_PRESETS = [
    {
        id: 'appTheme',
        background: new Color('#0b87c1'),
        color: new Color('#ace949'),
    },
    {
        id: 'white-black',
        background: new Color('#ffffff'),
        color: new Color('#000000'),
    },
    {
        id: 'black-white',
        background: new Color('#000000'),
        color: new Color('#ffffff'),
    },
    {
        id: 'wite-red',
        background: new Color('#ffffff'),
        color: new Color('#ff0000'),
    },
    {
        id: 'dune',
        background: new Color('#ebde89'),
        color: new Color('#ba7230'),
    },
    {
        id: 'open-game-art',
        background: new Color('#3d99ca'),
        color: new Color('#cbcb3f'),
    },
    {
        id: 'blue-green-light',
        background: new Color('#4499c8'),
        color: new Color('#caca4a'),
    },
    {
        id: 'blue-green',
        background: new Color('#0284c7'),
        color: new Color('#a3e635'),
    },
    {
        id: 'green-brown',
        background: new Color('#9fe24a'),
        color: new Color('#755716'),
    },
    {
        id: 'tile-pipe',
        background: new Color('#ffffff'),
        color: new Color('#b8e0ff'),
    },
];
export const DEFAULT_APP_SETTINGS = {
    imageSourceSettings: {
        outerBorderSize: 0,
        tileBorderSize: 0,
    },
    tileSets: {
        source: 0,
        output: 0,
    },
    renderSettings: {
        renderTileId: false,
        /** Transparent */
        background: new Color('#ffffff', 0),
        outerBorderSize: 0,
        tileBorderSize: 0,
    },
    bitMaskRenderSettings: {
        fancyBorders: true,
        background: COLOR_PRESETS[0].background,
        color: COLOR_PRESETS[0].color,
        hd: true,
    },
};
