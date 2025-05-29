export default function prepareImageFileForUpload(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = (e) => {
      const img = document.createElement("img");
      img.onload = function () {
        const MAX_WIDTH = 512;
        const MAX_HEIGHT = 512;

        let width = img.width;
        let height = img.height;
        // Calculate the scaling factor to fit within the max dimensions while preserving aspect ratio
        const widthRatio = MAX_WIDTH / width;
        const heightRatio = MAX_HEIGHT / height;
        const scale = Math.min(widthRatio, heightRatio, 1); // Don't upscale
        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0, width, height);

        const dataURL = canvas.toDataURL(file.type);

        resolve(dataURL);
      };
      img.src = e.target.result;
    };
    fr.readAsDataURL(file);
  });
}
