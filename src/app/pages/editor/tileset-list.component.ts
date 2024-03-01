// import { GenericTemplateComponent } from '../../components/generic-template.component.js';

import { SelectOption } from '../../classes/SelectOption.model.js';
import { AppSettings } from '../../classes/settings.model.js';
import { Signal, SignalListener } from '../../classes/signal.class.js';
import { TileSet } from '../../classes/TileSet.model.js';
import { TileSets } from '../../classes/TileSets.model.js';
import { BitMaskTiles } from '../../util/bit-mask-tiles.model.js';
import { Color } from '../../util/Color.js';
import {
  getRenderImageFromTiles,
  RenderImage,
} from '../../util/tile-set-worker.js';
import { HTMLElementsEditorListItemTemplate } from './html-elements-editor-list-item-template.js';

export class TileSetListComponent {
  private deleteSignal: Signal<number> = new Signal();
  private editSignal: Signal<number> = new Signal();

  public deleteEvent: SignalListener<number> = this.deleteSignal.getListener();
  public editEvent: SignalListener<number> = this.editSignal.getListener();

  constructor(
    private template: HTMLTemplateElement,
    private bitMaskTiles: BitMaskTiles,
    private appSettings: AppSettings,
  ) {}

  public update(parentElement: HTMLElement, tileSets: TileSets): void {
    parentElement.innerHTML = '';
    tileSets.sets.forEach((tileSet: TileSet, index: number) => {
      const item: DocumentFragment = this.createEditorListItemHtmlInstance(
        index,
        tileSet,
      );
      parentElement.appendChild(item);
    });
  }

  private createEditorListItemHtmlInstance(
    idx: number,
    tileSet: TileSet,
  ): DocumentFragment {
    const option: SelectOption = tileSet.toSelectOption(idx);
    // if (!HTML_ELEMENTS.editorListItemTemplate?.content) {
    //   throw new Error('Templates not supported in this browser :(');
    // }

    //  Clone template first
    const cloneInstance: DocumentFragment = this.template.content.cloneNode(
      true,
    ) as DocumentFragment;

    //HTML_TEMPLATE_ELEMENTS
    const cloneInstanceHtmlElements: HTMLElementsEditorListItemTemplate =
      new HTMLElementsEditorListItemTemplate(cloneInstance, idx);
    cloneInstanceHtmlElements.editorListItemTemplateDelete.addEventListener(
      'click',
      () => this.deleteSignal.send(idx),
    );
    cloneInstanceHtmlElements.editorListItemTemplateEdit.addEventListener(
      'click',
      () => this.editSignal.send(idx),
    );
    cloneInstanceHtmlElements.editorListItemTemplateDisplay.innerHTML =
      option.name;
    cloneInstanceHtmlElements.editorListItemTemplateLink.href =
      tileSet.link ?? '';
    cloneInstanceHtmlElements.editorListItemTemplateLink.innerHTML =
      tileSet.link
        ? '<i class="fa fa-external-link"></i>' //'🔗' //tileSet.name
        : '';
    this.renderEditorListItemPreview(
      tileSet,
      cloneInstanceHtmlElements.editorListItemTemplatePreview,
    );
    return cloneInstance;
  }

  private renderEditorListItemPreview(
    tileSet: TileSet,
    /** Image Element to render to */
    outputImageElement: HTMLImageElement,
  ): void {
    // TODO: Temp?
    const tileBorderSize = 1;
    const doRenderTileIds = true;
    const background = new Color(`#000000`);

    const renderImage: RenderImage = getRenderImageFromTiles(
      this.bitMaskTiles.tiles,
      tileSet,
      tileBorderSize,
      background,
      doRenderTileIds,
      this.appSettings.bitMaskRenderSettings.background,
      this.appSettings.bitMaskRenderSettings.color,
      this.appSettings.bitMaskRenderSettings.fancyBorders,
    );

    outputImageElement.src = renderImage.src;
  }
}

// export class TileSetListComponent extends GenericTemplateComponent<string> {
// constructor(template: HTMLTemplateElement) {
// // const template: HTMLTemplateElement = templateHtml;
//   super(template);
// }
// public update(): void {
//   super.update();
// }

// private templateBinding: TemplateBindingFn<string> = (
//   cloneInstance,
//   i,
//   data,
// ) => {
//   const HTML_TEMPLATE_ELEMENTS = new TileSetListTemplateHtmlElements(
//     cloneInstance,
//     i,
//   );
//   HTML_TEMPLATE_ELEMENTS.editorListItemTemplateDelete.addEventListener(
//     'click',
//     () => {
//       editTileSetDelete(idx);
//     },
//   );
//   HTML_TEMPLATE_ELEMENTS.editorListItemTemplateEdit.addEventListener(
//     'click',
//     () => {
//       editTileSetEdit(idx);
//     },
//   );
//   HTML_TEMPLATE_ELEMENTS.editorListItemTemplateDisplay.innerHTML =
//     option.name;
//   HTML_TEMPLATE_ELEMENTS.editorListItemTemplateLink.href = tileSet.link ?? '';
//   HTML_TEMPLATE_ELEMENTS.editorListItemTemplateLink.innerHTML = tileSet.link
//     ? '<i class="fa fa-external-link"></i>' //'🔗' //tileSet.name
//     : '';
//   renderEditorListItemPreview(
//     tileSet,
//     HTML_TEMPLATE_ELEMENTS.editorListItemTemplatePreview,
//   );
// };
// }
