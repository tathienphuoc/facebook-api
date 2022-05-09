const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json("hello");
});
router.use("/users", require("./user"));
router.use("/posts", require("./post"));
router.use("/comments", require("./comment"));

module.exports = router;
