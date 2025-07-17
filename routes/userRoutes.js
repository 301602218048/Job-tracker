const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/signup", userController.addUser);
router.post("/login", userController.userLogin);
router.post("/edit", auth.authenticate, userController.editUser);

module.exports = router;
