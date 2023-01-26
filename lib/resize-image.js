import sharp from "sharp";
const dataUriToBuffer = require("lib/data-uri-to-buffer");
import bufferToDataUrl from "buffer-to-data-url";

// Take an image as a data URL, convert it to a buffer, scale it down, and return a data URL
module.exports = async function resizeImage(dataUrl) {
  const MAX_SIZE = 512;

  const resizeOptions = {
    // preserve aspect ratio
    fit: "inside",

    // do not enlarge if the width or height are already less than the specified dimensions
    withoutEnlargement: true,
  };

  const buffer = await sharp(dataUriToBuffer(dataUrl))
    .resize(MAX_SIZE, MAX_SIZE, resizeOptions)
    .png()
    .toBuffer();

  // For testing
  // saveToDisk(buffer);

  return bufferToDataUrl("image/png", buffer);
};

// For testing...
function saveToDisk(buffer) {
  const fs = require("fs");
  const path = require("path");
  const filename = new Date().toISOString() + ".png";
  const homeDir = require("os").homedir();
  const desktopDir = path.join(homeDir, "Desktop");
  fs.writeFileSync(path.join(desktopDir, filename), buffer);
  console.log(path.join(desktopDir, filename));
}
