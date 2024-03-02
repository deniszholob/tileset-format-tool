// import { GenericTemplateComponent } from '../../components/generic-template.component.js';
import { Signal } from '../../classes/signal.class.js';
import { Color } from '../../util/Color.js';
import { getRenderImageFromTiles, } from '../../util/tile-set-worker.js';
import { HTMLElementsEditorListItemTemplate } from './html-elements-editor-list-item-template.js';
export class TileSetListComponent {
    template;
    bitMaskTiles;
    appSettings;
    deleteSignal = new Signal();
    editSignal = new Signal();
    deleteEvent = this.deleteSignal.getListener();
    editEvent = this.editSignal.getListener();
    constructor(template, bitMaskTiles, appSettings) {
        this.template = template;
        this.bitMaskTiles = bitMaskTiles;
        this.appSettings = appSettings;
    }
    update(parentElement, tileSets) {
        parentElement.innerHTML = '';
        tileSets.sets.forEach((tileSet, index) => {
            const item = this.createEditorListItemHtmlInstance(index, tileSet);
            parentElement.appendChild(item);
        });
    }
    createEditorListItemHtmlInstance(idx, tileSet) {
        const option = tileSet.toSelectOption(idx);
        // if (!HTML_ELEMENTS.editorListItemTemplate?.content) {
        //   throw new Error('Templates not supported in this browser :(');
        // }
        //  Clone template first
        const cloneInstance = this.template.content.cloneNode(true);
        //HTML_TEMPLATE_ELEMENTS
        const cloneInstanceHtmlElements = new HTMLElementsEditorListItemTemplate(cloneInstance, idx);
        cloneInstanceHtmlElements.editorListItemTemplateDelete.addEventListener('click', () => this.deleteSignal.send(idx));
        cloneInstanceHtmlElements.editorListItemTemplateEdit.addEventListener('click', () => this.editSignal.send(idx));
        cloneInstanceHtmlElements.editorListItemTemplateDisplay.innerHTML =
            option.name;
        cloneInstanceHtmlElements.editorListItemTemplateLink.href =
            tileSet.link ?? '';
        cloneInstanceHtmlElements.editorListItemTemplateLink.innerHTML =
            tileSet.link
                ? '<i class="fa fa-external-link"></i>' //'🔗' //tileSet.name
                : '';
        this.renderEditorListItemPreview(tileSet, cloneInstanceHtmlElements.editorListItemTemplatePreview);
        return cloneInstance;
    }
    renderEditorListItemPreview(tileSet, 
    /** Image Element to render to */
    outputImageElement) {
        // TODO: Temp?
        const tileBorderSize = 1;
        const doRenderTileIds = true;
        const background = new Color(`#000000`);
        const renderImage = getRenderImageFromTiles(this.bitMaskTiles.tiles, tileSet, tileBorderSize, background, doRenderTileIds, this.appSettings.bitMaskRenderSettings.background, this.appSettings.bitMaskRenderSettings.color, this.appSettings.bitMaskRenderSettings.fancyBorders);
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
