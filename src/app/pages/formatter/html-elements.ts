import { HtmlElementsBase } from '../../classes/HtmlElementsBase.model.js';

export class HtmlElementsMainPage extends HtmlElementsBase {
  public updateDate: HTMLSpanElement = this.getElementById('updateDate');

  constructor() {
    // console.log('HtmlElementsMainPage', document);
    super(document);
  }

  public bitMask: HTMLImageElement = this.getElementById('bitMask');
  public imageInput: HTMLInputElement = this.getElementById('imageInput');
  public uploadImagePreview: HTMLImageElement =
    this.getElementById('uploadImagePreview');
  public uploadImageDimensions: HTMLSpanElement = this.getElementById(
    'uploadImageDimensions',
  );
  // =================================================
  public tileSizeInput: HTMLInputElement = this.getElementById('tileSizeInput');
  public rowsInput: HTMLInputElement = this.getElementById('rowsInput');
  public columnsInput: HTMLInputElement = this.getElementById('columnsInput');

  // =================================================
  public sourceImageBorderSizeInput: HTMLInputElement = this.getElementById(
    'sourceImageBorderSizeInput',
  );
  public sourceBorderSizeInput: HTMLInputElement = this.getElementById(
    'sourceBorderSizeInput',
  );
  public outputBorderSizeInput: HTMLInputElement = this.getElementById(
    'outputBorderSizeInput',
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
  public outputImagePreview: HTMLImageElement =
    this.getElementById('outputImagePreview');
}
