const express = require("express");
const jobController = require("../controllers/jobController");
const auth = require("../middlewares/auth");
const upload = require("../utils/s3");

const router = express.Router();

router.post(
  "/addJob",
  auth.authenticate,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  jobController.addJob
);
router.get("/getAllJobs", auth.authenticate, jobController.getAllJobs);
router.get(
  "/getFilteredJobs",
  auth.authenticate,
  jobController.getFilteredJobs
);
router.put("/updateJob/:id", auth.authenticate, jobController.updateJob);
router.delete("/deleteJob/:id", auth.authenticate, jobController.deleteJob);

module.exports = router;
