import { HtmlElementsBase } from '../../classes/HtmlElementsBase.model.js';
export class HTMLElementsEditorListItemTemplate extends HtmlElementsBase {
    constructor(documentFragment, idx) {
        super(documentFragment);
        this.replaceIds(idx);
    }
    editorListItemTemplateDelete = this.getElementById('editorListItemTemplateDelete');
    editorListItemTemplateEdit = this.getElementById('editorListItemTemplateEdit');
    editorListItemTemplateDisplay = this.getElementById('editorListItemTemplateDisplay');
    editorListItemTemplateLink = this.getElementById('editorListItemTemplateLink');
    editorListItemTemplatePreview = this.getElementById('editorListItemTemplatePreview');
    replaceIds(idx) {
        [
            this.editorListItemTemplateDelete,
            this.editorListItemTemplateEdit,
            this.editorListItemTemplateDisplay,
            this.editorListItemTemplateLink,
            this.editorListItemTemplatePreview,
        ].forEach((v) => this.replaceElementID(v, idx));
    }
    replaceElementID(element, idx) {
        element.id = element.id.replace('Template', `_${idx}_`);
    }
}
