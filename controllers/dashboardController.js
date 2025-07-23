const { Op } = require("sequelize");
const Job = require("../models/job");

const getStatusSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await Job.sequelize.query(
      `
        SELECT status, COUNT(*) AS count
        FROM Jobs
        WHERE userId = :userId
        GROUP BY status
      `,
      {
        replacements: { userId: userId },
        type: Job.sequelize.QueryTypes.SELECT,
      }
    );
    if (!results || results.length === 0) {
      return res.status(200).json({ success: true, summary: {} });
    }
    const summary = Object.fromEntries(
      results.map((r) => [r.status, parseInt(r.count)])
    );
    res.status(200).json({ success: true, summary });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getTimelineStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.findAll({
      where: { userId: userId },
      attributes: [
        [
          Job.sequelize.fn("DATE", Job.sequelize.col("applicationDate")),
          "date",
        ],
        [Job.sequelize.fn("COUNT", Job.sequelize.col("id")), "count"],
      ],
      group: ["date"],
      order: [["date", "ASC"]],
    });

    const timeline = jobs.map((j) => ({
      date: j.dataValues.date,
      count: parseInt(j.dataValues.count),
    }));

    res.json({ success: true, timeline });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

module.exports = { getStatusSummary, getTimelineStats };
