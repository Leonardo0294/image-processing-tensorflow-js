// Función para cargar una imagen desde el input
async function loadImage(input) {
    return new Promise((resolve, reject) => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

// Función para mostrar una imagen en un canvas
function drawImageOnCanvas(img, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// Manipulación de la imagen al cargar un archivo
document.getElementById('uploadInput').addEventListener('change', async (event) => {
    const img = await loadImage(event.target);

    // Mostrar la imagen original
    drawImageOnCanvas(img, 'originalCanvas');

    // Convertir la imagen a un tensor
    const tensor = tf.browser.fromPixels(img);

    // Recortar la imagen (tomando una región de interés)
    const croppedTensor = tensor.slice([50, 50, 0], [200, 200, 3]); // Recortar desde (50,50) con ancho y alto de 200

    // Mostrar la imagen recortada en un canvas
    const croppedCanvas = document.getElementById('croppedCanvas');
    tf.browser.toPixels(croppedTensor, croppedCanvas);

    // Cambiar tamaño de la imagen
    const resizedTensor = tf.image.resizeBilinear(tensor, [400, 400]); // Cambiar tamaño a 400x400
    const resizedCanvas = document.getElementById('resizedCanvas');
    tf.browser.toPixels(resizedTensor, resizedCanvas);

    // Reflejar la imagen horizontalmente (espejo)
    const mirroredTensor = tf.image.flipLeftRight(tensor);
    const mirroredCanvas = document.getElementById('mirroredCanvas');
    tf.browser.toPixels(mirroredTensor, mirroredCanvas);
});
