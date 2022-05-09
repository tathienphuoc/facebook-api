const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const commentController = require("../controllers/comment");

router.get("/:id", verifyToken, commentController.getOne);
router.get("/", verifyToken, commentController.getAll);
router.post("/", verifyToken, commentController.save);

module.exports = router;
