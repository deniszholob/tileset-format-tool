export class HtmlElements {
  public imageInput: HTMLInputElement = this.getElementById('imageInput');
  public uploadImagePreview: HTMLImageElement =
    this.getElementById('uploadImagePreview');
  public uploadImageDimensions: HTMLSpanElement = this.getElementById(
    'uploadImageDimensions',
  );

  public tileSizeInput: HTMLInputElement = this.getElementById('tileSizeInput');
  public rowsInput: HTMLInputElement = this.getElementById('rowsInput');
  public columnsInput: HTMLInputElement = this.getElementById('columnsInput');

  public sourcePaddingInput: HTMLInputElement =
    this.getElementById('sourcePaddingInput');
  public outputPaddingInput: HTMLInputElement =
    this.getElementById('outputPaddingInput');

  public bgColorInput: HTMLInputElement = this.getElementById('bgColorInput');
  public bgAlphaInput: HTMLInputElement = this.getElementById('bgAlphaInput');

  public renderTileIds: HTMLInputElement = this.getElementById('renderTileIds');

  public inputImagePreview: HTMLImageElement =
    this.getElementById('inputImagePreview');
  public inputImagePreviewDimensions: HTMLSpanElement = this.getElementById(
    'inputImagePreviewDimensions',
  );

  public outputImagePreview: HTMLImageElement =
    this.getElementById('outputImagePreview');
  public outputImagePreviewDimensions: HTMLSpanElement = this.getElementById(
    'outputImagePreviewDimensions',
  );

  public inputImagePreviewLink: HTMLAnchorElement = this.getElementById(
    'inputImagePreviewLink',
  );
  public outputImagePreviewLink: HTMLAnchorElement = this.getElementById(
    'outputImagePreviewLink',
  );

  public inputTileSetSelect: HTMLSelectElement =
    this.getElementById('inputTileSetSelect');
  public outputTileSetSelect: HTMLSelectElement = this.getElementById(
    'outputTileSetSelect',
  );

  constructor() {}

  private getElementById<T extends HTMLElement>(name: string): T {
    const element: HTMLElement | null = document.getElementById(name);
    if (this.checkNull(element)) return element as T;
    throw new Error(`${name} does not exist: ${element}`);
  }

  private checkNull<T>(v?: T | null): v is T {
    return v != null;
  }
}
