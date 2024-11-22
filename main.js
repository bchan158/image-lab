const path = require("path");

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped/");
const pathProcessed = path.join(__dirname, "grayscaled");
const pathSepia = path.join(__dirname, "sepia");

async function main() {
  try {
    await IOhandler.unzip(zipFilePath, pathUnzipped);
    const pictureArray = await IOhandler.readDir(pathUnzipped);
    for (const pic of pictureArray) {
      await IOhandler.grayScale(
        path.join(pathUnzipped, pic),
        path.join(pathProcessed, pic)
      );
      await IOhandler.sepia(
        path.join(pathUnzipped, pic),
        path.join(pathSepia, pic)
      );
    }
  } catch (error) {
    console.error("Unable to add filter to image");
  }
}

main();
