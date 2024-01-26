import { HtmlElementsBase } from '../../classes/HtmlElementsBase.model.js';
export class HtmlElementsEditorPage extends HtmlElementsBase {
    updateDate = this.getElementById('updateDate');
    constructor() {
        // console.log('HtmlElementsEditorPage', document);
        super(document);
    }
    bitMask = this.getElementById('bitMask');
    editorSpace = this.getElementById('editorSpace');
    editTileSetName = this.getElementById('editTileSetName');
    editTileSetLink = this.getElementById('editTileSetLink');
    editTileSetConfig = this.getElementById('editTileSetConfig');
    editTileSetSave = this.getElementById('editTileSetSave');
    editTileSetAdd = this.getElementById('editTileSetAdd');
    // ------------------------------------------------------------------ //
    editTileSetPreviewContainer = this.getElementById('editTileSetPreviewContainer');
    editTileSetPreview = this.getElementById('editTileSetPreview');
    editTileSetPreviewLink = this.getElementById('editTileSetPreviewLink');
    editTileSetPreviewDimensions = this.getElementById('editTileSetPreviewDimensions');
    editTileSetPreviewName = this.getElementById('editTileSetPreviewName');
    editTileSetPreviewError = this.getElementById('editTileSetPreviewError');
    // ------------------------------------------------------------------ //
    editorList = this.getElementById('editorList');
    editorListItemTemplate = this.getElementById('editorListItemTemplate');
}
