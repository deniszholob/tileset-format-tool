import { GenericPageHtmlElements } from '../../components/generic-page.elements.js';

export class HtmlElementsFormatterPage extends GenericPageHtmlElements {
  public imageInput: HTMLInputElement = this.getElementById('imageInput');
  public uploadImagePreview: HTMLImageElement =
    this.getElementById('uploadImagePreview');
  public uploadImageDimensions: HTMLSpanElement = this.getElementById(
    'uploadImageDimensions',
  );
  public tileSize: HTMLSpanElement = this.getElementById('tileSize');

  // =================================================
  public sourceImageBorderSizeInput: HTMLInputElement = this.getElementById(
    'sourceImageBorderSizeInput',
  );
  public sourceTileBorderSizeInput: HTMLInputElement = this.getElementById(
    'sourceTileBorderSizeInput',
  );
  public outputImageBorderSizeInput: HTMLInputElement = this.getElementById(
    'outputImageBorderSizeInput',
  );
  public outputTileBorderSizeInput: HTMLInputElement = this.getElementById(
    'outputTileBorderSizeInput',
  );
  public bgColorInput: HTMLInputElement = this.getElementById('bgColorInput');
  public bgAlphaInput: HTMLInputElement = this.getElementById('bgAlphaInput');
  public renderTileIds: HTMLInputElement = this.getElementById('renderTileIds');

  // =================================================
  public inputTileSetSelect: HTMLSelectElement =
    this.getElementById('inputTileSetSelect');
  public inputTileSetLink: HTMLAnchorElement =
    this.getElementById('inputTileSetLink');
  // -------------------------------------------------
  public inputImageBitMaskLink: HTMLAnchorElement = this.getElementById(
    'inputImageBitMaskLink',
  );
  public inputImageBitMaskDimensions: HTMLSpanElement = this.getElementById(
    'inputImageBitMaskDimensions',
  );
  public inputImageBitMask: HTMLImageElement =
    this.getElementById('inputImageBitMask');

  // -------------------------------------------------
  public inputImagePreviewLink: HTMLAnchorElement = this.getElementById(
    'inputImagePreviewLink',
  );
  public inputImagePreviewDimensions: HTMLSpanElement = this.getElementById(
    'inputImagePreviewDimensions',
  );
  public inputImagePreviewLinkGodotTres: HTMLAnchorElement =
    this.getElementById('inputImagePreviewLinkGodotTres');
  public inputImagePreview: HTMLImageElement =
    this.getElementById('inputImagePreview');

  // =================================================
  public outputTileSetSelect: HTMLSelectElement = this.getElementById(
    'outputTileSetSelect',
  );
  public outputTileSetLink: HTMLAnchorElement =
    this.getElementById('outputTileSetLink');
  // -------------------------------------------------
  public outputImageBitMaskLink: HTMLAnchorElement = this.getElementById(
    'outputImageBitMaskLink',
  );
  public outputImageBitMaskDimensions: HTMLSpanElement = this.getElementById(
    'outputImageBitMaskDimensions',
  );
  public outputImageBitMask: HTMLImageElement =
    this.getElementById('outputImageBitMask');

  // -------------------------------------------------
  public outputImagePreviewLink: HTMLAnchorElement = this.getElementById(
    'outputImagePreviewLink',
  );
  public outputImagePreviewDimensions: HTMLSpanElement = this.getElementById(
    'outputImagePreviewDimensions',
  );
  public outputImagePreviewLinkGodotTres: HTMLAnchorElement =
    this.getElementById('outputImagePreviewLinkGodotTres');
  public outputImagePreview: HTMLImageElement =
    this.getElementById('outputImagePreview');
}
