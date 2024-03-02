import { TileSet } from '../../classes/TileSet.model.js';
import { TileSets } from '../../classes/TileSets.model.js';
import { GenericPageComponent } from '../../components/generic-page.component.js';
import { NAV_LINKS } from '../../data/links.data.js';
import { Color } from '../../util/Color.js';
import { CSVConverter } from '../../util/CSVConverter.js';
import { downloadJSONtoFile } from '../../util/data-util.ts.js';
import { renderTileSet } from '../../util/tile-set-renderer.js';
import { getRenderImageFromTiles, } from '../../util/tile-set-worker.js';
import { EditorPageHtmlElements } from './editor-page.elements.js';
import { TileSetListComponent } from './tileset-list.component.js';
// TODO: Probably should be its own "TileSetFormClass"
const DEFAULT_TILE_SET_NAME = 'New';
const DEFAULT_TILE_SET_LINK = '';
const DEFAULT_TILE_SET_CONFIG = ',28,112\n255,7,193,255_a';
// class TileSetFormClass {
//   private newTileSetName: string = DEFAULT_TILE_SET_NAME;
//   private newTileSetLink: string = DEFAULT_TILE_SET_LINK;
//   private newTileSetConfig: string = DEFAULT_TILE_SET_CONFIG;
// }
export class EditorPageComponent extends GenericPageComponent {
    // TODO: these 3 Probably should be its own "TileSetFormClass"
    newTileSetName = DEFAULT_TILE_SET_NAME;
    newTileSetLink = DEFAULT_TILE_SET_LINK;
    newTileSetConfig = DEFAULT_TILE_SET_CONFIG;
    tileSetEditIdx = undefined;
    constructor() {
        super(new EditorPageHtmlElements(), NAV_LINKS[1]);
        this.HTML_ELEMENTS.editTileSetConfig.placeholder = DEFAULT_TILE_SET_CONFIG;
        this.syncStateWithHtml();
        this.renderConfig();
    }
    // ============================== Public ================================= //
    // ------------------------------------------------------------------ //
    onUploadTileSets() {
        const json = prompt('Paste json to save to local storage');
        if (!json)
            return;
        try {
            const jsonParsed = TileSets.getTileSetsFromJson(json);
            this.tileSets = jsonParsed;
            this.onSaveTileSets();
        }
        catch (error) {
            alert(error);
        }
    }
    onDownloadTileSets() {
        const fileName = 'TileSetsConfig';
        const json = this.tileSets.toJson(2);
        downloadJSONtoFile(json, fileName);
    }
    onResetTileSets() {
        const yes = confirm('Are you sure you want to reset the Tile Sets?\n You can download first before resetting');
        if (!yes)
            return;
        this.appLocalStorageService.clearTileSets();
        this.loadTileSets();
        this.renderConfig();
    }
    onClearTileSets() {
        const yes = confirm('Are you sure you want to clear the Tile Sets?\n You can download first before clearing');
        if (!yes)
            return;
        this.tileSets = new TileSets();
        this.appLocalStorageService.saveTileSets(this.tileSets);
        this.renderConfig();
    }
    // ------------------------------------------------------------------ //
    onUpdateEditTileSetName() {
        this.newTileSetName = this.HTML_ELEMENTS.editTileSetName.value;
        this.updatePreview();
    }
    onUpdateEditTileSetLink() {
        this.newTileSetLink = this.HTML_ELEMENTS.editTileSetLink.value;
        this.updatePreview();
    }
    onUpdateEditTileSetConfig() {
        this.newTileSetConfig = this.HTML_ELEMENTS.editTileSetConfig.value;
        this.newTileSetConfig = this.newTileSetConfig
            .replaceAll('[', '')
            .replaceAll('],', '')
            .replaceAll(']', '')
            .replaceAll(' ', '');
        this.HTML_ELEMENTS.editTileSetConfig.value = this.newTileSetConfig;
        this.updatePreview();
    }
    // ------------------------------------------------------------------ //
    onSaveTileSets() {
        this.tileSets.sets.filter((v) => !!v);
        this.appLocalStorageService.saveTileSets(this.tileSets);
        this.renderConfig();
    }
    editTileSetSave(index) {
        // TODO: Save to tilesets
        if (this.tileSets.sets[index]) {
            const saveTileSet = new TileSet({
                name: this.newTileSetName,
                link: this.newTileSetLink,
                set: CSVConverter.csvToMatrix(this.newTileSetConfig),
            });
            this.tileSets.sets[index] = saveTileSet;
            this.appLocalStorageService.saveTileSets(this.tileSets);
            this.editTileSetReset();
            this.editTileSetCancel();
            this.renderConfig();
        }
        else {
            this.editTileSetAdd();
        }
    }
    editTileSetAdd() {
        const newTileSet = new TileSet({
            name: this.newTileSetName,
            link: this.newTileSetLink,
            set: CSVConverter.csvToMatrix(this.newTileSetConfig),
        });
        this.tileSets.sets.push(newTileSet);
        this.appLocalStorageService.saveTileSets(this.tileSets);
        this.editTileSetCancel();
        this.editTileSetReset();
        this.renderConfig();
    }
    editTileSetCancel() {
        this.HTML_ELEMENTS.editorSpace.classList.add('hidden');
        // Default to "Add"
        this.HTML_ELEMENTS.editTileSetSave.classList.add('hidden');
        this.HTML_ELEMENTS.editTileSetAdd.classList.remove('hidden');
        this.tileSetEditIdx = undefined;
    }
    editTileSetReset() {
        if (this.tileSetEditIdx != null &&
            this.tileSets.sets[this.tileSetEditIdx]) {
            const tileSet = this.tileSets.sets[this.tileSetEditIdx];
            this.newTileSetName = tileSet.name;
            this.newTileSetLink = tileSet.link ?? '';
            this.newTileSetConfig = tileSet.toSetCSV();
        }
        else {
            this.newTileSetName = DEFAULT_TILE_SET_NAME;
            this.newTileSetLink = DEFAULT_TILE_SET_LINK;
            this.newTileSetConfig = DEFAULT_TILE_SET_CONFIG;
        }
        this.syncStateWithHtml();
        this.updatePreview();
    }
    // ------------------------------------------------------------------ //
    editTileSetNew() {
        this.HTML_ELEMENTS.editorSpace.classList.remove('hidden');
        this.HTML_ELEMENTS.editTileSetSave.classList.add('hidden');
        this.HTML_ELEMENTS.editTileSetAdd.classList.remove('hidden');
        this.tileSetEditIdx = undefined;
        this.scrollToEditor();
        this.editTileSetReset();
    }
    editTileSetEdit(index) {
        this.HTML_ELEMENTS.editorSpace.classList.remove('hidden');
        this.HTML_ELEMENTS.editTileSetSave.classList.remove('hidden');
        this.HTML_ELEMENTS.editTileSetAdd.classList.add('hidden');
        this.scrollToEditor();
        this.tileSetEditIdx = index;
        this.HTML_ELEMENTS.editTileSetSave.addEventListener('click', () => this.editTileSetSave(index), { once: true });
        this.newTileSetName = this.tileSets.sets[index].name;
        this.newTileSetLink = this.tileSets.sets[index].link ?? '';
        this.newTileSetConfig = this.tileSets.sets[index].toSetCSV();
        this.syncStateWithHtml();
        this.updatePreview(); // TODO:
    }
    editTileSetDelete(idx) {
        const yes = confirm('Are you sure you want to delete this tile set?');
        if (!yes)
            return;
        console.log(this.tileSets);
        this.tileSets.sets.splice(idx, 1).filter((v) => !!v);
        this.HTML_ELEMENTS.editTileSetSave.removeEventListener('click', () => {
            this.editTileSetSave(idx);
        });
        this.appLocalStorageService.saveTileSets(this.tileSets);
        this.renderConfig();
    }
    // ============================== Private ================================= //
    loadTileSets() {
        this.tileSets = this.appLocalStorageService.loadTileSets();
    }
    syncStateWithHtml() {
        this.HTML_ELEMENTS.editTileSetName.value = this.newTileSetName;
        this.HTML_ELEMENTS.editTileSetLink.value = this.newTileSetLink;
        this.HTML_ELEMENTS.editTileSetConfig.value = this.newTileSetConfig;
    }
    renderConfig() {
        const imageSettings = this.appLocalStorageService.loadAppSettings();
        const tileSetListComponent = new TileSetListComponent(this.HTML_ELEMENTS.editorListItemTemplate, this.bitMaskTiles, imageSettings);
        tileSetListComponent.deleteEvent.listen((i) => this.editTileSetDelete(i));
        tileSetListComponent.editEvent.listen((i) => this.editTileSetEdit(i));
        tileSetListComponent.update(this.HTML_ELEMENTS.editorList, this.tileSets);
    }
    /** https://stackoverflow.com/questions/3163615/how-to-scroll-an-html-page-to-a-given-anchor */
    scrollToEditor() {
        this.HTML_ELEMENTS.editorSpace.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
        });
    }
    // ==== // TODO: reuse from  TileSetListComponent somehow?
    updatePreview() {
        try {
            const tileSet = new TileSet({
                name: this.newTileSetName,
                link: this.newTileSetLink,
                set: CSVConverter.csvToMatrix(this.newTileSetConfig),
            });
            // TODO: Temp?
            const tileBorderSize = 1;
            const doRenderTileIds = true;
            const background = new Color(`#000000`);
            const tileRender = getRenderImageFromTiles(this.bitMaskTiles.tiles, tileSet, tileBorderSize, background, doRenderTileIds, this.appSettings.bitMaskRenderSettings.background, this.appSettings.bitMaskRenderSettings.color, this.appSettings.bitMaskRenderSettings.fancyBorders);
            this.HTML_ELEMENTS.editTileSetPreviewName.innerText = this.newTileSetName;
            renderTileSet(tileRender, this.HTML_ELEMENTS.editTileSetPreview, this.HTML_ELEMENTS.editTileSetPreviewLink, this.HTML_ELEMENTS.editTileSetPreviewDimensions, this.newTileSetName);
            this.HTML_ELEMENTS.editTileSetPreviewError.innerText = '';
        }
        catch (error) {
            this.HTML_ELEMENTS.editTileSetPreviewError.innerText = String(error);
        }
    }
}
