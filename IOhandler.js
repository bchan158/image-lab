const fs = require("fs").promises;
const { createReadStream, createWriteStream } = require("fs");
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
const inputPath = path.join(__dirname, "./myfile.zip");
const outputPath = path.join(__dirname, "./unzipped/");

async function checkFolder() {
  try {
    await fs.access(outputPath);
    console.log("Folder exists");
  } catch {
    console.log("Creating folder");
    await fs.mkdir(outputPath);
  }
}

const unzip = async (pathIn, pathOut) => {
  const zip = await yauzl.open(pathIn);
  try {
    checkFolder();
    for await (const entry of zip) {
      if (entry.filename.endsWith("/")) {
        await fs.mkdir(`${pathOut}${entry.filename}`);
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = createWriteStream(`${pathOut}${entry.filename}`);
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
    console.log("Extraction operation complete");
  }
};

// unzip(inputPath, outputPath);

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
let picArray = [];

const readDir = async (dir) => {
  try {
    const files = await fs.readdir(dir);
    const pngFiles = files
      .filter((file) => path.extname(file) === ".png")
      .map((file) => path.join(dir, file));
    picArray = [...pngFiles];
    return picArray;
  } catch (error) {
    console.error("Unable to read files in the directory");
  }
};

// readDir(outputPath);

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const fileInput = "./unzipped/in.png";
const fileOutput = "./grayscaled/out.png";

const grayScale = async (pathIn, pathOut) => {
  createReadStream(pathIn)
    .pipe(
      new PNG({
        colorType: 0,
      })
    )
    .on("parsed", function () {
      for (var i = 0; i < this.data.length; i += 4) {
        let r = this.data[i];
        let g = this.data[i + 1];
        let b = this.data[i + 2];
        let a = this.data[i + 3];
      }
      this.pack().pipe(createWriteStream(pathOut));
    });
};

grayScale(fileInput, fileOutput);

const sepia = async (pathIn, pathOut) => {
  createReadStream(pathIn)
    .pipe(new PNG())
    .on("parsed", function () {
      for (var i = 0; i < this.data.length; i += 4) {
        let r = this.data[i];
        let g = this.data[i + 1];
        let b = this.data[i + 2];
        let a = this.data[i + 3];

        let tr = 0.393 * r + 0.769 * g + 0.189 * b;
        let tg = 0.349 * r + 0.686 * g + 0.168 * b;
        let tb = 0.272 * r + 0.534 * g + 0.131 * b;

        this.data[i] = Math.min(255, tr);
        this.data[i + 1] = Math.min(255, tg);
        this.data[i + 2] = Math.min(255, tb);
      }
      this.pack().pipe(createWriteStream(pathOut));
    });
};

sepia("./unzipped/in1.png", "./sepia/out1.png");

module.exports = {
  unzip,
  readDir,
  grayScale,
  sepia,
};
