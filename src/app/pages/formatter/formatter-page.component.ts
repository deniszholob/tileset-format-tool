import { SelectOption } from '../../classes/SelectOption.model.js';
import { AppSettings } from '../../classes/settings.model.js';
import { TileSet } from '../../classes/TileSet.model.js';
import { GenericPageComponent } from '../../components/generic-page.component.js';
import { NAV_LINKS } from '../../data/links.data.js';
import { BIT_MASK_TILE_SET } from '../../data/tile-set-bit-mask.data.js';
import { Color } from '../../util/Color.js';
import { checkImageLoaded, getImageFromFile } from '../../util/html-util.js';
import { renderTileSet } from '../../util/tile-set-renderer.js';
import {
  cutImageIntoTiles,
  getRenderImageFromTiles,
  RenderImage,
  RenderSet,
} from '../../util/tile-set-worker.js';
import { HtmlElementsFormatterPage } from './formatter-page.elements.js';

interface UserUpload {
  fileName: string;
  fileExtension: string;
  image: HTMLImageElement;
}
export class FormatterPageComponent extends GenericPageComponent<HtmlElementsFormatterPage> {
  private TILE_SET_OPTIONS: SelectOption[] = this.tileSets.toSelectOptions();

  private userUpload: UserUpload | undefined = undefined;
  private imageRenderSet: RenderSet | undefined = undefined;

  private tileSize: number = 32;
  private numRows: number = 1;
  private numCols: number = 1;

  private sourceImageBorderSize: number = 0;
  private sourceTileBorderSize: number = 0;
  private outputImageBorderSize: number = 0;
  private outputTileBorderSize: number = 0;

  private bgColor: string = '#bbbbbb';
  private bgAlpha: number = 100;

  private doRenderTileIds: boolean = false;

  // =======
  private _inputTileSetId: number = 1;
  private set inputTileSetId(id: number) {
    this._inputTileSetId = id;
    this.selectedInputTileSet = this.getSelectedTileSet(id);
  }
  private get inputTileSetId(): number {
    return this._inputTileSetId;
  }
  private selectedInputTileSet: TileSet = this.getSelectedTileSet(
    this.inputTileSetId,
  );

  // =======
  private _outputTileSetId: number = 0;
  private set outputTileSetId(id: number) {
    this._outputTileSetId = id;
    this.selectedOutputTileSet = this.getSelectedTileSet(id);
  }
  private get outputTileSetId(): number {
    return this._outputTileSetId;
  }
  private selectedOutputTileSet: TileSet = this.getSelectedTileSet(
    this.outputTileSetId,
  );

  constructor() {
    super(new HtmlElementsFormatterPage(), NAV_LINKS[0]);
    this.loadPresetsFromLocalStorage();
    this.renderBitMaskTiles();
    this.populateTileSelects();
    this.syncStateWithHtml();
    this.onUpdateInputTileSet();
    this.onUpdateOutputTileSet();
  }

  private loadPresetsFromLocalStorage(): void {
    const settings: AppSettings = this.appLocalStorageService.loadAppSettings();
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
  public async onImageUpload(): Promise<void> {
    const file: File | undefined = this.HTML_ELEMENTS.imageInput.files?.[0];
    // if (!file) throw new Error(`No file Uploaded`);
    // if(!file) return;
    if (!file) {
      alert('Please select an image file.');
      return;
    }

    const image: HTMLImageElement = await getImageFromFile(file);
    const [fileName, fileExtension] = file.name.split('.');
    this.userUpload = { image, fileExtension, fileName };
    this.HTML_ELEMENTS.uploadImagePreview.src = this.userUpload.image.src;
    this.HTML_ELEMENTS.uploadImageDimensions.textContent = `${this.userUpload.image.width}x${this.userUpload.image.height} px`;

    this.recalculateInputImageVars();
    this.reRenderInputImagePreview();
    this.reRenderOutputImagePreview();
  }

  public onUpdateSourceImageBorderSize(): void {
    this.sourceImageBorderSize =
      parseInt(this.HTML_ELEMENTS.sourceImageBorderSizeInput.value) || 0;
    this.recalculateInputImageVars();
    this.reRenderInputImagePreview();
    this.reRenderOutputImagePreview();
  }

  public onUpdateSourceTileBorderSize(): void {
    this.sourceTileBorderSize =
      parseInt(this.HTML_ELEMENTS.sourceTileBorderSizeInput.value) || 0;
    this.recalculateInputImageVars();
    this.reRenderInputImagePreview();
    this.reRenderOutputImagePreview();
  }

  public onUpdateOutputImageBorderSize(): void {
    this.outputImageBorderSize =
      parseInt(this.HTML_ELEMENTS.outputImageBorderSizeInput.value) || 0;
    this.onProcessImage();
  }

  public onUpdateOutputTileBorderSize(): void {
    this.outputTileBorderSize =
      parseInt(this.HTML_ELEMENTS.outputTileBorderSizeInput.value) || 0;
    this.onProcessImage();
  }

  public onUpdateBgColor(): void {
    this.bgColor = this.HTML_ELEMENTS.bgColorInput.value;
    this.onProcessImage();
  }

  public onUpdateBgAlpha(): void {
    this.bgAlpha = this.HTML_ELEMENTS.bgAlphaInput.valueAsNumber;
    this.onProcessImage();
  }

  public onToggleRenderTileIds(): void {
    this.doRenderTileIds = !this.doRenderTileIds;
    this.onProcessImage();
  }

  public onProcessImage(): void {
    this.reRenderInputImagePreview();
    this.reRenderOutputImagePreview();
    this.reRenderInputImageBitMask();
    this.reRenderOutputImageBitMask();
  }

  public onUpdateInputTileSet(): void {
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

  public onUpdateOutputTileSet(): void {
    this.outputTileSetId = parseInt(
      this.HTML_ELEMENTS.outputTileSetSelect.value,
    );

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

  private syncStateWithHtml(): void {
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

  private getSelectedTileSet(idx: number): TileSet {
    return this.tileSets.sets?.[idx] ?? BIT_MASK_TILE_SET;
  }

  private populateTileSelects(): void {
    this.createHTMLSelectOptions(
      this.HTML_ELEMENTS.inputTileSetSelect,
      this.TILE_SET_OPTIONS,
    );
    this.createHTMLSelectOptions(
      this.HTML_ELEMENTS.outputTileSetSelect,
      this.TILE_SET_OPTIONS,
    );
  }

  private renderBitMaskTiles(): void {
    this.reRenderInputImageBitMask();
    this.reRenderOutputImageBitMask();
  }

  private reRenderInputImageBitMask(): void {
    const tileRender: RenderImage = getRenderImageFromTiles(
      this.bitMaskTiles.tiles,
      this.selectedInputTileSet,
      this.outputTileBorderSize,
      new Color(this.bgColor, this.bgAlpha),
      this.doRenderTileIds,
      this.appSettings.bitMaskRenderSettings.background,
      this.appSettings.bitMaskRenderSettings.color,
      this.appSettings.bitMaskRenderSettings.fancyBorders,
    );
    renderTileSet(
      tileRender,
      this.HTML_ELEMENTS.inputImageBitMask,
      this.HTML_ELEMENTS.inputImageBitMaskLink,
      this.HTML_ELEMENTS.inputImageBitMaskDimensions,
      this.getDownloadLink(true, this.selectedInputTileSet.name),
    );
  }

  private reRenderOutputImageBitMask(): void {
    const tileRender: RenderImage = getRenderImageFromTiles(
      this.bitMaskTiles.tiles,
      this.selectedOutputTileSet,
      this.outputTileBorderSize,
      new Color(this.bgColor, this.bgAlpha),
      this.doRenderTileIds,
      this.appSettings.bitMaskRenderSettings.background,
      this.appSettings.bitMaskRenderSettings.color,
      this.appSettings.bitMaskRenderSettings.fancyBorders,
    );
    renderTileSet(
      tileRender,
      this.HTML_ELEMENTS.outputImageBitMask,
      this.HTML_ELEMENTS.outputImageBitMaskLink,
      this.HTML_ELEMENTS.outputImageBitMaskDimensions,
      this.getDownloadLink(true, this.selectedOutputTileSet.name),
    );
  }

  private reRenderInputImagePreview(): void {
    if (this.imageRenderSet && this.userUpload) {
      const tileRender: RenderImage = getRenderImageFromTiles(
        this.imageRenderSet,
        this.selectedInputTileSet,
        this.outputTileBorderSize,
        new Color(this.bgColor, this.bgAlpha),
        this.doRenderTileIds,
      );

      renderTileSet(
        tileRender,
        this.HTML_ELEMENTS.inputImagePreview,
        this.HTML_ELEMENTS.inputImagePreviewLink,
        this.HTML_ELEMENTS.inputImagePreviewDimensions,
        this.getDownloadLink(
          false,
          this.selectedInputTileSet.name,
          this.selectedInputTileSet.name,
        ),
      );
    }
  }

  private reRenderOutputImagePreview(): void {
    if (this.imageRenderSet && this.userUpload) {
      const tileRender: RenderImage = getRenderImageFromTiles(
        this.imageRenderSet,
        this.selectedOutputTileSet,
        this.outputTileBorderSize,
        new Color(this.bgColor, this.bgAlpha),
        this.doRenderTileIds,
      );
      renderTileSet(
        tileRender,
        this.HTML_ELEMENTS.outputImagePreview,
        this.HTML_ELEMENTS.outputImagePreviewLink,
        this.HTML_ELEMENTS.outputImagePreviewDimensions,
        this.getDownloadLink(
          false,
          this.selectedOutputTileSet.name,
          this.selectedOutputTileSet.name,
        ),
      );
    }
  }

  // Helper functions

  private recalculateRowsCols(): void {
    this.numRows = this.selectedInputTileSet.numRows;
    this.numCols = this.selectedInputTileSet.numCols;
  }

  /** Recalculates tile size, rows, columns based on image and tile set selected */
  private recalculateInputImageVars(): void {
    const image: HTMLImageElement | undefined = this.userUpload?.image;
    if (checkImageLoaded(image)) {
      this.tileSize = this.getTileSizeFromImage(
        image,
        this.sourceImageBorderSize,
      );
      this.imageRenderSet = cutImageIntoTiles(
        image,
        this.tileSize,
        this.selectedInputTileSet,
        this.sourceTileBorderSize,
        this.sourceImageBorderSize,
      );
    } else {
      this.tileSize = 0;
      this.imageRenderSet = undefined;
    }
    this.syncStateWithHtml();
  }

  /** Needs to have tile set selected and numCols/numRows recalculated beforehand */
  private getTileSizeFromImage(
    image: HTMLImageElement,
    imageBorderSize: number = 0,
  ): number {
    const effectiveImageWidth: number = image.width - 2 * imageBorderSize;
    const effectiveImageHeight: number = image.height - 2 * imageBorderSize;
    return Math.max(
      effectiveImageWidth / this.numCols,
      effectiveImageHeight / this.numRows,
    );
  }

  private getDownloadLink(
    isBitMask: boolean,
    tileSetName: string,
    inputTileSetName?: string,
  ): string {
    const fileExtension: string =
      !this.userUpload?.fileExtension || !isBitMask
        ? 'png'
        : this.userUpload.fileExtension;
    const fileName: string = this.userUpload?.fileName
      ? `${this.userUpload?.fileName}_`
      : '';
    const bitMaskName: string = isBitMask ? '_BitMask' : '';
    const downloadName = `${fileName.replace(inputTileSetName ?? '', '')}${tileSetName}${bitMaskName}`;
    return `${downloadName}.${fileExtension}`;
  }
}
