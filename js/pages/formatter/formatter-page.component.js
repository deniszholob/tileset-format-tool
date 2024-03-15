import { GodotTresData } from '../../classes/GodotBitMask.model.js';
import { GenericPageComponent } from '../../components/generic-page.component.js';
import { NAV_LINKS } from '../../data/links.data.js';
import { BIT_MASK_TILE_SET } from '../../data/tile-set-bit-mask.data.js';
import { Color } from '../../util/Color.js';
import { setAnchorDownloadDataFile } from '../../util/data-util.ts.js';
import { checkImageLoaded, getImageFromFile } from '../../util/html-util.js';
import { renderTileSet } from '../../util/tile-set-renderer.js';
import { cutImageIntoTiles, getRenderImageFromTiles, } from '../../util/tile-set-worker.js';
import { HtmlElementsFormatterPage } from './formatter-page.elements.js';
export class FormatterPageComponent extends GenericPageComponent {
    TILE_SET_OPTIONS = this.tileSets.toSelectOptions();
    userUpload = undefined;
    imageRenderSet = undefined;
    tileSize = 32;
    numRows = 1;
    numCols = 1;
    sourceImageBorderSize = 0;
    sourceTileBorderSize = 0;
    outputImageBorderSize = 0;
    outputTileBorderSize = 0;
    bgColor = '#bbbbbb';
    bgAlpha = 100;
    doRenderTileIds = false;
    // =======
    _inputTileSetId = 1;
    set inputTileSetId(id) {
        this._inputTileSetId = id;
        this.selectedInputTileSet = this.getSelectedTileSet(id);
    }
    get inputTileSetId() {
        return this._inputTileSetId;
    }
    selectedInputTileSet = this.getSelectedTileSet(this.inputTileSetId);
    // =======
    _outputTileSetId = 0;
    set outputTileSetId(id) {
        this._outputTileSetId = id;
        this.selectedOutputTileSet = this.getSelectedTileSet(id);
    }
    get outputTileSetId() {
        return this._outputTileSetId;
    }
    selectedOutputTileSet = this.getSelectedTileSet(this.outputTileSetId);
    constructor() {
        super(new HtmlElementsFormatterPage(), NAV_LINKS[0]);
        this.loadPresetsFromLocalStorage();
        this.renderBitMaskTiles();
        this.populateTileSelects();
        this.syncStateWithHtml();
        this.onUpdateInputTileSet();
        this.onUpdateOutputTileSet();
    }
    loadPresetsFromLocalStorage() {
        const settings = this.appLocalStorageService.loadAppSettings();
        this.sourceImageBorderSize = settings.imageSourceSettings.outerBorderSize;
        this.sourceTileBorderSize = settings.imageSourceSettings.tileBorderSize;
        this.outputImageBorderSize = settings.renderSettings.outerBorderSize;
        this.outputTileBorderSize = settings.renderSettings.tileBorderSize;
        this.bgColor = settings.renderSettings.background.hex;
        this.bgAlpha = settings.renderSettings.background.a100;
        this.doRenderTileIds = settings.renderSettings.renderTileId;
        this.inputTileSetId = settings.tileSets.source;
        this.outputTileSetId = settings.tileSets.output;
    }
    // ============================== Public ================================= //
    async onImageUpload() {
        const file = this.HTML_ELEMENTS.imageInput.files?.[0];
        // if (!file) throw new Error(`No file Uploaded`);
        // if(!file) return;
        if (!file) {
            alert('Please select an image file.');
            return;
        }
        const image = await getImageFromFile(file);
        const [fileName, fileExtension] = file.name.split('.');
        this.userUpload = { image, fileExtension, fileName };
        this.HTML_ELEMENTS.uploadImagePreview.src = this.userUpload.image.src;
        this.HTML_ELEMENTS.uploadImageDimensions.textContent = `${this.userUpload.image.width}x${this.userUpload.image.height} px`;
        this.recalculateInputImageVars();
        this.reRenderInputImagePreview();
        this.reRenderOutputImagePreview();
    }
    onUpdateSourceImageBorderSize() {
        this.sourceImageBorderSize =
            parseInt(this.HTML_ELEMENTS.sourceImageBorderSizeInput.value) || 0;
        this.recalculateInputImageVars();
        this.reRenderInputImagePreview();
        this.reRenderOutputImagePreview();
    }
    onUpdateSourceTileBorderSize() {
        this.sourceTileBorderSize =
            parseInt(this.HTML_ELEMENTS.sourceTileBorderSizeInput.value) || 0;
        this.recalculateInputImageVars();
        this.reRenderInputImagePreview();
        this.reRenderOutputImagePreview();
    }
    onUpdateOutputImageBorderSize() {
        this.outputImageBorderSize =
            parseInt(this.HTML_ELEMENTS.outputImageBorderSizeInput.value) || 0;
        this.onProcessImage();
    }
    onUpdateOutputTileBorderSize() {
        this.outputTileBorderSize =
            parseInt(this.HTML_ELEMENTS.outputTileBorderSizeInput.value) || 0;
        this.onProcessImage();
    }
    onUpdateBgColor() {
        this.bgColor = this.HTML_ELEMENTS.bgColorInput.value;
        this.onProcessImage();
    }
    onUpdateBgAlpha() {
        this.bgAlpha = this.HTML_ELEMENTS.bgAlphaInput.valueAsNumber;
        this.onProcessImage();
    }
    onToggleRenderTileIds() {
        this.doRenderTileIds = !this.doRenderTileIds;
        this.onProcessImage();
    }
    onProcessImage() {
        this.reRenderInputImagePreview();
        this.reRenderOutputImagePreview();
        this.reRenderInputImageBitMask();
        this.reRenderOutputImageBitMask();
    }
    onUpdateInputTileSet() {
        this.inputTileSetId = parseInt(this.HTML_ELEMENTS.inputTileSetSelect.value);
        this.selectedInputTileSet = this.getSelectedTileSet(this.inputTileSetId);
        this.HTML_ELEMENTS.inputTileSetLink.href =
            this.selectedInputTileSet.link ?? '';
        this.HTML_ELEMENTS.inputTileSetLink.innerHTML = this.selectedInputTileSet
            .link
            ? this.selectedInputTileSet.name
            : '';
        this.reRenderInputImageBitMask();
        this.recalculateRowsCols();
        this.recalculateInputImageVars();
        this.reRenderInputImagePreview();
        this.onUpdateOutputTileSet();
    }
    onUpdateOutputTileSet() {
        this.outputTileSetId = parseInt(this.HTML_ELEMENTS.outputTileSetSelect.value);
        this.HTML_ELEMENTS.outputTileSetLink.href =
            this.selectedOutputTileSet.link ?? '';
        this.HTML_ELEMENTS.outputTileSetLink.innerHTML = this.selectedOutputTileSet
            .link
            ? this.selectedOutputTileSet.name
            : '';
        this.reRenderOutputImageBitMask();
        this.reRenderOutputImagePreview();
    }
    // ============================== Private ================================= //
    syncStateWithHtml() {
        this.HTML_ELEMENTS.tileSize.textContent = this.tileSize
            ? `${this.tileSize} px`
            : '---';
        this.HTML_ELEMENTS.sourceImageBorderSizeInput.valueAsNumber =
            this.sourceImageBorderSize;
        this.HTML_ELEMENTS.sourceTileBorderSizeInput.valueAsNumber =
            this.sourceTileBorderSize;
        this.HTML_ELEMENTS.outputImageBorderSizeInput.valueAsNumber =
            this.outputImageBorderSize;
        this.HTML_ELEMENTS.outputTileBorderSizeInput.valueAsNumber =
            this.outputTileBorderSize;
        this.HTML_ELEMENTS.bgColorInput.value = this.bgColor;
        this.HTML_ELEMENTS.bgAlphaInput.valueAsNumber = this.bgAlpha;
        this.HTML_ELEMENTS.renderTileIds.checked = this.doRenderTileIds;
        this.HTML_ELEMENTS.inputTileSetSelect.selectedIndex = this.inputTileSetId;
        this.HTML_ELEMENTS.outputTileSetSelect.selectedIndex = this.outputTileSetId;
    }
    getSelectedTileSet(idx) {
        return this.tileSets.sets?.[idx] ?? BIT_MASK_TILE_SET;
    }
    populateTileSelects() {
        this.createHTMLSelectOptions(this.HTML_ELEMENTS.inputTileSetSelect, this.TILE_SET_OPTIONS);
        this.createHTMLSelectOptions(this.HTML_ELEMENTS.outputTileSetSelect, this.TILE_SET_OPTIONS);
    }
    renderBitMaskTiles() {
        this.reRenderInputImageBitMask();
        this.reRenderOutputImageBitMask();
    }
    reRenderInputImageBitMask() {
        const tileRender = getRenderImageFromTiles(this.bitMaskTiles.tiles, this.selectedInputTileSet, this.outputTileBorderSize, new Color(this.bgColor, this.bgAlpha), this.doRenderTileIds, this.appSettings.bitMaskRenderSettings.background, this.appSettings.bitMaskRenderSettings.color, this.appSettings.bitMaskRenderSettings.fancyBorders);
        renderTileSet(tileRender, this.HTML_ELEMENTS.inputImageBitMask, this.HTML_ELEMENTS.inputImageBitMaskLink, this.HTML_ELEMENTS.inputImageBitMaskDimensions, this.getDownloadLink(true, this.selectedInputTileSet.name));
    }
    reRenderOutputImageBitMask() {
        const tileRender = getRenderImageFromTiles(this.bitMaskTiles.tiles, this.selectedOutputTileSet, this.outputTileBorderSize, new Color(this.bgColor, this.bgAlpha), this.doRenderTileIds, this.appSettings.bitMaskRenderSettings.background, this.appSettings.bitMaskRenderSettings.color, this.appSettings.bitMaskRenderSettings.fancyBorders);
        renderTileSet(tileRender, this.HTML_ELEMENTS.outputImageBitMask, this.HTML_ELEMENTS.outputImageBitMaskLink, this.HTML_ELEMENTS.outputImageBitMaskDimensions, this.getDownloadLink(true, this.selectedOutputTileSet.name));
    }
    reRenderInputImagePreview() {
        if (this.imageRenderSet && this.userUpload) {
            const tileRender = getRenderImageFromTiles(this.imageRenderSet, this.selectedInputTileSet, this.outputTileBorderSize, new Color(this.bgColor, this.bgAlpha), this.doRenderTileIds);
            const godotTresData = new GodotTresData(this.tileSize, this.userUpload.fileName, this.userUpload.fileExtension, this.selectedInputTileSet);
            setAnchorDownloadDataFile(this.HTML_ELEMENTS.inputImagePreviewLinkGodotTres, godotTresData.toTres(), godotTresData.tileTextureFileUri);
            renderTileSet(tileRender, this.HTML_ELEMENTS.inputImagePreview, this.HTML_ELEMENTS.inputImagePreviewLink, this.HTML_ELEMENTS.inputImagePreviewDimensions, this.getDownloadLink(false, this.selectedInputTileSet.name, this.selectedInputTileSet.name));
        }
    }
    reRenderOutputImagePreview() {
        if (this.imageRenderSet && this.userUpload) {
            const tileRender = getRenderImageFromTiles(this.imageRenderSet, this.selectedOutputTileSet, this.outputTileBorderSize, new Color(this.bgColor, this.bgAlpha), this.doRenderTileIds);
            const godotTresData = new GodotTresData(this.tileSize, this.userUpload.fileName, this.userUpload.fileExtension, this.selectedOutputTileSet);
            setAnchorDownloadDataFile(this.HTML_ELEMENTS.outputImagePreviewLinkGodotTres, godotTresData.toTres(), godotTresData.tileTextureFileUri);
            renderTileSet(tileRender, this.HTML_ELEMENTS.outputImagePreview, this.HTML_ELEMENTS.outputImagePreviewLink, this.HTML_ELEMENTS.outputImagePreviewDimensions, this.getDownloadLink(false, this.selectedOutputTileSet.name, this.selectedOutputTileSet.name));
        }
    }
    // Helper functions
    recalculateRowsCols() {
        this.numRows = this.selectedInputTileSet.numRows;
        this.numCols = this.selectedInputTileSet.numCols;
    }
    /** Recalculates tile size, rows, columns based on image and tile set selected */
    recalculateInputImageVars() {
        const image = this.userUpload?.image;
        if (checkImageLoaded(image)) {
            this.tileSize = this.getTileSizeFromImage(image, this.sourceImageBorderSize);
            this.imageRenderSet = cutImageIntoTiles(image, this.tileSize, this.selectedInputTileSet, this.sourceTileBorderSize, this.sourceImageBorderSize);
        }
        else {
            this.tileSize = 0;
            this.imageRenderSet = undefined;
        }
        this.syncStateWithHtml();
    }
    /** Needs to have tile set selected and numCols/numRows recalculated beforehand */
    getTileSizeFromImage(image, imageBorderSize = 0) {
        const effectiveImageWidth = image.width - 2 * imageBorderSize;
        const effectiveImageHeight = image.height - 2 * imageBorderSize;
        return Math.max(effectiveImageWidth / this.numCols, effectiveImageHeight / this.numRows);
    }
    getDownloadLink(isBitMask, tileSetName, inputTileSetName) {
        const fileExtension = !this.userUpload?.fileExtension || !isBitMask
            ? 'png'
            : this.userUpload.fileExtension;
        const fileName = this.userUpload?.fileName
            ? `${this.userUpload?.fileName}_`
            : '';
        const bitMaskName = isBitMask ? '_BitMask' : '';
        const downloadName = `${fileName.replace(inputTileSetName ?? '', '')}${tileSetName}${bitMaskName}`;
        return `${downloadName}.${fileExtension}`;
    }
}
