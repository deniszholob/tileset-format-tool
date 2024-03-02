import { BaseHtmlElements } from '../classes/base.elements.js';
export class GenericPageHtmlElements extends BaseHtmlElements {
    bitMask32 = this.getElementById('bitMask32');
    bitMask64 = this.getElementById('bitMask64');
    updateDate = this.getElementById('updateDate');
    navLinks = this.getElementById('navLinks');
    templateNavItem = this.getElementById('templateNavItem');
    constructor() {
        super(document);
    }
}
