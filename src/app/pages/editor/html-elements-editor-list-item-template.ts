import { BaseHtmlElements } from '../../classes/base.elements.js';

export class HTMLElementsEditorListItemTemplate extends BaseHtmlElements {
  constructor(documentFragment: DocumentFragment, idx: number) {
    super(documentFragment);
    this.replaceIds(idx);
  }

  public editorListItemTemplateDelete: HTMLButtonElement = this.getElementById(
    'editorListItemTemplateDelete',
  );
  public editorListItemTemplateEdit: HTMLButtonElement = this.getElementById(
    'editorListItemTemplateEdit',
  );
  public editorListItemTemplateDisplay: HTMLSpanElement = this.getElementById(
    'editorListItemTemplateDisplay',
  );
  public editorListItemTemplateLink: HTMLAnchorElement = this.getElementById(
    'editorListItemTemplateLink',
  );
  public editorListItemTemplatePreview: HTMLImageElement = this.getElementById(
    'editorListItemTemplatePreview',
  );

  public replaceIds(idx: number): void {
    [
      this.editorListItemTemplateDelete,
      this.editorListItemTemplateEdit,
      this.editorListItemTemplateDisplay,
      this.editorListItemTemplateLink,
      this.editorListItemTemplatePreview,
    ].forEach((v) => this.replaceElementID(v, idx));
  }

  private replaceElementID(element: HTMLElement, idx: number): void {
    element.id = element.id.replace('Template', `_${idx}_`);
  }
}
