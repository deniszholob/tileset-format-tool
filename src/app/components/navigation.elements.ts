import { BaseHtmlElements } from '../classes/base.elements.js';

export class HTMLElementsTemplateNavigation extends BaseHtmlElements {
  private readonly IDX_KEY: string = '_idx_';

  public templateNavLink: HTMLAnchorElement = this.getElementById(
    `templateNavLink${this.IDX_KEY}`,
  );

  constructor(
    documentFragment: DocumentFragment,
    private idx: number,
  ) {
    super(documentFragment);
    this.replaceIds([this.templateNavLink]);
  }

  private replaceIds(elements: HTMLElement[]): void {
    elements.forEach((v: HTMLElement): void => this.replaceElementID(v));
  }

  private replaceElementID(element: HTMLElement): void {
    element.id = element.id.replace(this.IDX_KEY, `_${this.idx}_`);
  }
}
