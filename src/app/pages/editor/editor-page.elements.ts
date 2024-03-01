import { GenericPageHtmlElements } from '../../components/generic-page.elements.js';

export class EditorPageHtmlElements extends GenericPageHtmlElements {
  public editorSpace: HTMLDivElement = this.getElementById('editorSpace');

  // ---------------------------- Editor Form ---------------------------- //
  public editTileSetName: HTMLInputElement =
    this.getElementById('editTileSetName');
  public editTileSetLink: HTMLInputElement =
    this.getElementById('editTileSetLink');
  public editTileSetConfig: HTMLTextAreaElement =
    this.getElementById('editTileSetConfig');

  public editTileSetSave: HTMLButtonElement =
    this.getElementById('editTileSetSave');
  public editTileSetAdd: HTMLButtonElement =
    this.getElementById('editTileSetAdd');

  // ---------------------------- Editor Preview ---------------------------- //
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

  // ---------------------------- Tileset List  ---------------------------- //
  public editorList: HTMLDivElement = this.getElementById('editorList');
  public editorListItemTemplate: HTMLTemplateElement = this.getElementById(
    'editorListItemTemplate',
  );
}
