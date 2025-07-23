const Job = require("../models/job");
const Company = require("../models/company");
const { uploadToS3 } = require("../utils/s3");
const { Op } = require("sequelize");

const addJob = async (req, res) => {
  try {
    const { company, title, applicationDate, followupDate, status, notes } =
      req.body;

    const resumeUrl = req.files.resume
      ? await uploadToS3(req.files.resume[0])
      : null;
    const coverLetterUrl = req.files.coverLetter
      ? await uploadToS3(req.files.coverLetter[0])
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
      resume: resumeUrl,
      coverLetter: coverLetterUrl,
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

    const jobWhere = {
      userId: req.user.id,
    };

    if (status) {
      jobWhere.status = status;
    }

    if (startDate || endDate) {
      jobWhere.applicationDate = {};
      if (startDate) jobWhere.applicationDate[Op.gte] = new Date(startDate);
      if (endDate) jobWhere.applicationDate[Op.lte] = new Date(endDate);
    }

    const searchFilter = search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { "$company.company$": { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const jobs = await Job.findAll({
      where: {
        ...jobWhere,
        ...searchFilter,
      },
      include: [
        {
          model: Company,
          attributes: ["company"],
        },
      ],
    });

    res.status(200).json({ msg: "Jobs retrieved", success: true, jobs });
  } catch (error) {
    console.error("Error in getFilteredJobs:", error);
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
    const data = req.body;
    data.resume = req.files.resume
      ? await uploadToS3(req.files.resume[0])
      : null;
    data.coverLetter = req.files.coverLetter
      ? await uploadToS3(req.files.coverLetter[0])
      : null;
    await job.update(data);
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
