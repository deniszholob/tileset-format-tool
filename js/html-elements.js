export class HtmlElements {
    constructor() {
        this.imageInput = this.getElementById('imageInput');
        this.uploadImagePreview = this.getElementById('uploadImagePreview');
        this.uploadImageDimensions = this.getElementById('uploadImageDimensions');
        this.tileSizeInput = this.getElementById('tileSizeInput');
        this.rowsInput = this.getElementById('rowsInput');
        this.columnsInput = this.getElementById('columnsInput');
        this.sourcePaddingInput = this.getElementById('sourcePaddingInput');
        this.outputPaddingInput = this.getElementById('outputPaddingInput');
        this.bgColorInput = this.getElementById('bgColorInput');
        this.bgAlphaInput = this.getElementById('bgAlphaInput');
        this.renderTileIds = this.getElementById('renderTileIds');
        this.inputImagePreview = this.getElementById('inputImagePreview');
        this.inputImagePreviewDimensions = this.getElementById('inputImagePreviewDimensions');
        this.outputImagePreview = this.getElementById('outputImagePreview');
        this.outputImagePreviewDimensions = this.getElementById('outputImagePreviewDimensions');
        this.inputImagePreviewLink = this.getElementById('inputImagePreviewLink');
        this.outputImagePreviewLink = this.getElementById('outputImagePreviewLink');
        this.inputTileSetSelect = this.getElementById('inputTileSetSelect');
        this.outputTileSetSelect = this.getElementById('outputTileSetSelect');
    }
    getElementById(name) {
        const element = document.getElementById(name);
        if (this.checkNull(element))
            return element;
        throw new Error(`${name} does not exist: ${element}`);
    }
    checkNull(v) {
        return v != null;
    }
}
