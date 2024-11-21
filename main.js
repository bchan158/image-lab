const path = require("path");
const { unzip, readDir, grayScale, sepia } = require("./IOhandler.js");

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const pathSepia = path.join(__dirname, "sepia");
