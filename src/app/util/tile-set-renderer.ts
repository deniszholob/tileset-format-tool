import { RenderImage } from './tile-set-worker.js';

export function renderTileSet(
  /** Data to render */
  renderImage: RenderImage,
  /** Image Element to render to */
  outputImageElement: HTMLImageElement,
  /** Anchor element to use as click to download */
  outputImageLinkElement: HTMLAnchorElement,
  /** Span Element to display dimension data */
  outputImageDimensionsElement: HTMLSpanElement,
  /** What should the downloadable file be saved as  */
  downloadName: string,
): void {
  outputImageElement.src = renderImage.src;
  outputImageLinkElement.href = renderImage.src;
  outputImageLinkElement.download = downloadName;
  outputImageDimensionsElement.textContent = `${renderImage.width}x${renderImage.height}`;
}
