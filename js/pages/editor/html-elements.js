import { HtmlElementsBase } from '../../classes/HtmlElementsBase.model.js';
export class HtmlElementsEditorPage extends HtmlElementsBase {
    bitMask = this.getElementById('bitMask');
    editorSpace = this.getElementById('editorSpace');
    editTileSetName = this.getElementById('editTileSetName');
    editTileSetLink = this.getElementById('editTileSetLink');
    editTileSetConfig = this.getElementById('editTileSetConfig');
    editTileSetPreviewContainer = this.getElementById('editTileSetPreviewContainer');
    editTileSetPreview = this.getElementById('editTileSetPreview');
    editTileSetPreviewLink = this.getElementById('editTileSetPreviewLink');
    editTileSetPreviewDimensions = this.getElementById('editTileSetPreviewDimensions');
    editTileSetPreviewName = this.getElementById('editTileSetPreviewName');
    editTileSetPreviewError = this.getElementById('editTileSetPreviewError');
}
