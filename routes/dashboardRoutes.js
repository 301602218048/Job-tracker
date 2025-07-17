const express = require("express");
const auth = require("../middlewares/auth");
const dbc = require("../controllers/dashboardController");

const router = express.Router();

router.get("/status-summary", auth.authenticate, dbc.getStatusSummary);
router.get("/timeline", auth.authenticate, dbc.getTimelineStats);

module.exports = router;
