import { GenericPageHtmlElements } from '../../components/generic-page.elements.js';
export class HtmlElementsFormatterPage extends GenericPageHtmlElements {
    imageInput = this.getElementById('imageInput');
    uploadImagePreview = this.getElementById('uploadImagePreview');
    uploadImageDimensions = this.getElementById('uploadImageDimensions');
    tileSize = this.getElementById('tileSize');
    // =================================================
    sourceImageBorderSizeInput = this.getElementById('sourceImageBorderSizeInput');
    sourceTileBorderSizeInput = this.getElementById('sourceTileBorderSizeInput');
    outputImageBorderSizeInput = this.getElementById('outputImageBorderSizeInput');
    outputTileBorderSizeInput = this.getElementById('outputTileBorderSizeInput');
    bgColorInput = this.getElementById('bgColorInput');
    bgAlphaInput = this.getElementById('bgAlphaInput');
    renderTileIds = this.getElementById('renderTileIds');
    // =================================================
    inputTileSetSelect = this.getElementById('inputTileSetSelect');
    inputTileSetLink = this.getElementById('inputTileSetLink');
    // -------------------------------------------------
    inputImageBitMaskLink = this.getElementById('inputImageBitMaskLink');
    inputImageBitMaskDimensions = this.getElementById('inputImageBitMaskDimensions');
    inputImageBitMask = this.getElementById('inputImageBitMask');
    // -------------------------------------------------
    inputImagePreviewLink = this.getElementById('inputImagePreviewLink');
    inputImagePreviewDimensions = this.getElementById('inputImagePreviewDimensions');
    inputImagePreview = this.getElementById('inputImagePreview');
    // =================================================
    outputTileSetSelect = this.getElementById('outputTileSetSelect');
    outputTileSetLink = this.getElementById('outputTileSetLink');
    // -------------------------------------------------
    outputImageBitMaskLink = this.getElementById('outputImageBitMaskLink');
    outputImageBitMaskDimensions = this.getElementById('outputImageBitMaskDimensions');
    outputImageBitMask = this.getElementById('outputImageBitMask');
    // -------------------------------------------------
    outputImagePreviewLink = this.getElementById('outputImagePreviewLink');
    outputImagePreviewDimensions = this.getElementById('outputImagePreviewDimensions');
    outputImagePreview = this.getElementById('outputImagePreview');
}
