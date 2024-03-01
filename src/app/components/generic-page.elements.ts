import { BaseHtmlElements } from '../classes/base.elements.js';

export class GenericPageHtmlElements extends BaseHtmlElements {
  public bitMask32: HTMLImageElement = this.getElementById('bitMask32');
  public bitMask64: HTMLImageElement = this.getElementById('bitMask64');

  public updateDate: HTMLSpanElement = this.getElementById('updateDate');

  public navLinks: HTMLDivElement = this.getElementById('navLinks');
  public templateNavItem: HTMLTemplateElement =
    this.getElementById('templateNavItem');

  constructor() {
    super(document);
  }
}
