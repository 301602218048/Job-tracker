const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const jobController = require("../controllers/jobController");
const auth = require("../middlewares/auth");

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
router.put(
  "/updateJob/:id",
  auth.authenticate,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  jobController.updateJob
);
router.delete("/deleteJob/:id", auth.authenticate, jobController.deleteJob);

module.exports = router;
