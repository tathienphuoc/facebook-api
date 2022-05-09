const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const handleFileUpload = require("../middleware/handleFileUpload");
const postController = require("../controllers/post");
// const connection = require("../socket").connection();


router.post("/like", verifyToken, postController.like);
router.post("/delete", verifyToken, postController.delete);
router.get("/:id", verifyToken, postController.getOne);
router.get("/", verifyToken, postController.getAll);
router.post("/", verifyToken, handleFileUpload, postController.save);
router.put("/", verifyToken, handleFileUpload, postController.update);

module.exports = router;
