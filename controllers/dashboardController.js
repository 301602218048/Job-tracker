const { Op } = require("sequelize");
const Job = require("../models/job");

const getStatusSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.findAll({
      where: { userId },
      attributes: [
        "status",
        [Job.sequelize.fn("COUNT", Job.sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });

    const summary = jobs.reduce((acc, j) => {
      acc[j.status] = parseInt(j.dataValues.count);
      return acc;
    }, {});

    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getTimelineStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const where = { userId };
    if (startDate || endDate) where.applicationDate = {};
    if (startDate) where.applicationDate[Op.gte] = startDate;
    if (endDate) where.applicationDate[Op.lte] = endDate;

    const jobs = await Job.findAll({
      where,
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
