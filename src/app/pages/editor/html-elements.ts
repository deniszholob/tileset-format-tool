import { HtmlElementsBase } from '../../classes/HtmlElementsBase.model.js';

export class HtmlElementsEditorPage extends HtmlElementsBase {
  public updateDate: HTMLSpanElement = this.getElementById('updateDate');

  constructor() {
    // console.log('HtmlElementsEditorPage', document);
    super(document);
  }

  public bitMask: HTMLImageElement = this.getElementById('bitMask');
  public editorSpace: HTMLDivElement = this.getElementById('editorSpace');

  public editTileSetName: HTMLInputElement =
    this.getElementById('editTileSetName');
  public editTileSetLink: HTMLInputElement =
    this.getElementById('editTileSetLink');
  public editTileSetConfig: HTMLTextAreaElement =
    this.getElementById('editTileSetConfig');

  public editTileSetSave: HTMLTextAreaElement =
    this.getElementById('editTileSetSave');
  public editTileSetAdd: HTMLTextAreaElement =
    this.getElementById('editTileSetAdd');

  // ------------------------------------------------------------------ //
  public editTileSetPreviewContainer: HTMLDivElement = this.getElementById(
    'editTileSetPreviewContainer',
  );
  public editTileSetPreview: HTMLImageElement =
    this.getElementById('editTileSetPreview');
  public editTileSetPreviewLink: HTMLAnchorElement = this.getElementById(
    'editTileSetPreviewLink',
  );
  public editTileSetPreviewDimensions: HTMLSpanElement = this.getElementById(
    'editTileSetPreviewDimensions',
  );
  public editTileSetPreviewName: HTMLSpanElement = this.getElementById(
    'editTileSetPreviewName',
  );
  public editTileSetPreviewError: HTMLParagraphElement = this.getElementById(
    'editTileSetPreviewError',
  );

  // ------------------------------------------------------------------ //
  public editorList: HTMLDivElement = this.getElementById('editorList');
  public editorListItemTemplate: HTMLTemplateElement = this.getElementById(
    'editorListItemTemplate',
  );
}
