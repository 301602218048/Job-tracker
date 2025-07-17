const express = require("express");
const profileController = require("../controllers/profileController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/cgoal", auth.authenticate, profileController.addCareerGoal);
router.get("/getCGoals", auth.authenticate, profileController.getCGoals);

module.exports = router;
