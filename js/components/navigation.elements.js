import { BaseHtmlElements } from '../classes/base.elements.js';
export class HTMLElementsTemplateNavigation extends BaseHtmlElements {
    idx;
    IDX_KEY = '_idx_';
    templateNavLink = this.getElementById(`templateNavLink${this.IDX_KEY}`);
    constructor(documentFragment, idx) {
        super(documentFragment);
        this.idx = idx;
        this.replaceIds([this.templateNavLink]);
    }
    replaceIds(elements) {
        elements.forEach((v) => this.replaceElementID(v));
    }
    replaceElementID(element) {
        element.id = element.id.replace(this.IDX_KEY, `_${this.idx}_`);
    }
}
