const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const userController = require("../controllers/user");

router.get("/:id", verifyToken, userController.getOne);
router.get("/", verifyToken, userController.getAll);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", verifyToken, userController.logout);

module.exports = router;
