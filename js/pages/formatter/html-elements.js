import { HtmlElementsBase } from '../../classes/HtmlElementsBase.model.js';
export class HtmlElementsMainPage extends HtmlElementsBase {
    bitMask = this.getElementById('bitMask');
    imageInput = this.getElementById('imageInput');
    uploadImagePreview = this.getElementById('uploadImagePreview');
    uploadImageDimensions = this.getElementById('uploadImageDimensions');
    // =================================================
    tileSizeInput = this.getElementById('tileSizeInput');
    rowsInput = this.getElementById('rowsInput');
    columnsInput = this.getElementById('columnsInput');
    // =================================================
    sourceImageBorderSizeInput = this.getElementById('sourceImageBorderSizeInput');
    sourceBorderSizeInput = this.getElementById('sourceBorderSizeInput');
    outputBorderSizeInput = this.getElementById('outputBorderSizeInput');
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
