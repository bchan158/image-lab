const fs = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");
const yauzl = require("yauzl-promise"),
  { pipeline } = require("stream/promises");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const zipFileLocation = path.join(__dirname, "./myfile.zip");
const outputLocation = path.join(__dirname, "./unzipped/");

function checkUnippedFolder() {}

const unzip = async (pathIn, pathOut) => {
  const zip = await yauzl.open(zipFileLocation);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith("/")) {
        await fs.promises.mkdir(`/${outputLocation}${entry.filename}`);
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(
          `${outputLocation}${entry.filename}`
        );
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
  }
};

unzip();

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
