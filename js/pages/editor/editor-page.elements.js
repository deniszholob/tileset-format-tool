import { GenericPageHtmlElements } from '../../components/generic-page.elements.js';
export class EditorPageHtmlElements extends GenericPageHtmlElements {
    editorSpace = this.getElementById('editorSpace');
    // ---------------------------- Editor Form ---------------------------- //
    editTileSetName = this.getElementById('editTileSetName');
    editTileSetLink = this.getElementById('editTileSetLink');
    editTileSetConfig = this.getElementById('editTileSetConfig');
    editTileSetSave = this.getElementById('editTileSetSave');
    editTileSetAdd = this.getElementById('editTileSetAdd');
    // ---------------------------- Editor Preview ---------------------------- //
    editTileSetPreviewContainer = this.getElementById('editTileSetPreviewContainer');
    editTileSetPreview = this.getElementById('editTileSetPreview');
    editTileSetPreviewLink = this.getElementById('editTileSetPreviewLink');
    editTileSetPreviewDimensions = this.getElementById('editTileSetPreviewDimensions');
    editTileSetPreviewName = this.getElementById('editTileSetPreviewName');
    editTileSetPreviewError = this.getElementById('editTileSetPreviewError');
    // ---------------------------- Tileset List  ---------------------------- //
    editorList = this.getElementById('editorList');
    editorListItemTemplate = this.getElementById('editorListItemTemplate');
}
