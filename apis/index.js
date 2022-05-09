const imgbbUploader = require("imgbb-uploader");
require("dotenv").config();

const API = {
  saveImage: async (path) => imgbbUploader(process.env.IMGBB_KEY, path),
};

module.exports = API;
