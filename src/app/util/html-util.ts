export function renderTextOnCanvas(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
): void {
  context.imageSmoothingEnabled = false;
  // context.textRendering = 'geometricPrecision';
  context.fillStyle = 'black';
  // context.font = `${fontSize}px Arial`;
  context.font = `${Math.round(fontSize)}px VT323 monospace`;
  // console.log(Math.round(fontSize));

  const lines: string[] = text.split('\n');
  lines.forEach((line: string, i: number) => {
    const textWidth: number = context.measureText(line).width;
    const textX: number = x - textWidth / 2;
    const textY: number = y; // + fontSize / 2;
    context.fillText(line, textX, textY + fontSize * i);
  });
  // context.fillText(text, textX, textY);
}

export async function getImageFromFile(file: File): Promise<HTMLImageElement> {
  const imageUrl: string = URL.createObjectURL(file);
  const image = new Image();
  image.src = imageUrl;

  return new Promise((resolve) => {
    image.onload = () => {
      resolve(image);
    };
  });
}

export function checkImageLoaded(
  image?: HTMLImageElement,
): image is HTMLImageElement {
  if (!image) {
    // alert('Please select an image file.');
    return false;
  }
  return true;
}

export function htmlImageToCanvasImage(
  image: HTMLImageElement,
): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!context) throw new Error(`Cannot load Canvas Context`);
  context.imageSmoothingEnabled = false;

  canvas.width = image.width;
  canvas.height = image.height;

  context.drawImage(image, 0, 0);
  return canvas;
}

// function handleImageUpload() {
//   const inputElement = document.getElementById('imageInput');
//   const inputImagePreview = document.getElementById('inputImagePreview');

//   const file = inputElement.files[0];

//   if (file) {
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       inputImagePreview.src = event.target.result;
//     };

//     reader.readAsDataURL(file);
//   }
// }

/** @ref https://learnersbucket.com/examples/interview/convert-hex-color-to-rgb-in-javascript/ */
export class Color {
  /** #000000 */
  hex: string;
  /** */
  a: number;
  r: number;
  g: number;
  b: number;

  /**
   * @param hex Hex color value, e.g. #000000
   * @param alpha 0-100
   */
  constructor(hex: string, alpha: number) {
    if (hex.length !== 7 || hex.charAt(0) !== '#') {
      throw new Error('Invalid hex code: ' + hex);
    }
    this.hex = hex;
    this.a = alpha / 100;

    this.r = parseInt(hex.slice(1, 3), 16);
    this.g = parseInt(hex.slice(3, 5), 16);
    this.b = parseInt(hex.slice(5, 7), 16);
  }

  toString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
