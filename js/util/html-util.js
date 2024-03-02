export function renderTextOnCanvas(context, text, x, y, fontSize) {
    context.imageSmoothingEnabled = false;
    // context.textRendering = 'geometricPrecision';
    context.fillStyle = 'black';
    // context.font = `${fontSize}px Arial`;
    context.font = `${Math.round(fontSize)}px VT323 monospace`;
    // console.log(Math.round(fontSize));
    const lines = text.split('\n');
    lines.forEach((line, i) => {
        const textWidth = context.measureText(line).width;
        const textX = x - textWidth / 2;
        const textY = y; // + fontSize / 2;
        context.fillText(line, textX, textY + fontSize * i);
    });
    // context.fillText(text, textX, textY);
}
export async function getImageFromFile(file) {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = imageUrl;
    return new Promise((resolve) => {
        image.onload = () => {
            resolve(image);
        };
    });
}
export function checkImageLoaded(image) {
    if (!image) {
        // alert('Please select an image file.');
        return false;
    }
    return true;
}
export function htmlImageToCanvasImage(image) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context)
        throw new Error(`Cannot load Canvas Context`);
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
