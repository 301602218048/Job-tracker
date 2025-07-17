const Job = require("../models/job");
const Company = require("../models/company");
const { Op } = require("sequelize");

const addJob = async (req, res) => {
  try {
    const { company, title, applicationDate, followupDate, status, notes } =
      req.body;

    const resume = req.files.resume ? req.files.resume[0].location : null;
    const coverLetter = req.files.coverLetter
      ? req.files.coverLetter[0].location
      : null;

    const [companyInstance] = await Company.findOrCreate({
      where: { company: company, userId: req.user.id },
    });

    await Job.create({
      title,
      applicationDate,
      followupDate,
      status,
      notes,
      resume,
      coverLetter,
      userId: req.user.id,
      companyId: companyInstance.id,
    });

    res.status(201).json({ msg: "Job added successfully", success: true });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { userId: req.user.id } });
    if (!jobs || jobs.length === 0) {
      return res.status(204).json({ msg: "No jobs found", success: false });
    }
    res.status(200).json({ msg: "List of all jobs", success: true, jobs });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

const getFilteredJobs = async (req, res) => {
  try {
    const { search, status, startDate, endDate } = req.query;

    const whereClause = {
      userId: req.user.id,
    };

    if (status) {
      whereClause.status = status;
    }

    if (startDate || endDate) {
      whereClause.applicationDate = {};
      if (startDate) {
        whereClause.applicationDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.applicationDate[Op.lte] = new Date(endDate);
      }
    }

    const includeClause = [
      {
        model: Company,
        attributes: ["company"],
        ...(search && {
          where: {
            company: { [Op.iLike]: `%${search}%` },
          },
          required: true,
        }),
      },
    ];

    const jobs = await Job.findAll({
      where: whereClause,
      include: includeClause,
    });

    res.status(200).json({ msg: "Jobs retrieved", success: true, jobs });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findOne({ where: { id: jobId, userId } });

    if (!job) {
      return res.status(404).json({ msg: "Job not found", success: false });
    }

    const updatedFields = req.body;

    await job.update(updatedFields);

    res
      .status(200)
      .json({ msg: "Job updated successfully", success: true, job });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findOne({ where: { id: jobId, userId } });

    if (!job) {
      return res.status(404).json({ msg: "Job not found", success: false });
    }

    await job.destroy();

    res.status(200).json({ msg: "Job deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

module.exports = {
  addJob,
  getAllJobs,
  getFilteredJobs,
  updateJob,
  deleteJob,
};
