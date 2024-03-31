export function renderTileSet(
/** Data to render */
renderImage, 
/** Image Element to render to */
outputImageElement, 
/** Anchor element to use as click to download */
outputImageLinkElement, 
/** Span Element to display dimension data */
outputImageDimensionsElement, 
/** What should the downloadable file be saved as  */
downloadName) {
    outputImageElement.src = renderImage.src;
    outputImageLinkElement.href = renderImage.src;
    outputImageLinkElement.download = downloadName;
    outputImageDimensionsElement.textContent = `${renderImage.width}x${renderImage.height}`;
}
