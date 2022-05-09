const API = require("../apis");

module.exports = async (req, res, next) => {
  if (req.files || req.body.urls) {
    try {
      let files = [];
      if (req.body.urls) {
        req.body.urls = Array.isArray(req.body.urls)
          ? req.body.urls
          : [req.body.urls];
        files = req.body.urls;
      }
      if (req.files) {
        req.files = Array.isArray(req.files.files)
          ? req.files.files
          : [req.files.files];
        files = [...files, ...req.files];
      }

      req.files = files;

      const promises = req.files.map(async (file) => {
        if (typeof file === "string" || file instanceof String) {
          return { url: file };
        } else {
          return API.saveImage(file.tempFilePath);
        }
      });

      const response = await Promise.all(promises);
      req.files = response.map((file) => file.url);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
  next();
};
