const { Company, Job } = require("../models");

const createCompany = async (req, res) => {
  try {
    const company = await Company.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, company });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error creating company: " + error.message,
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { userId: req.user.id },
      include: { model: Job },
    });

    res.status(200).json({ success: true, companies });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error fetching companies: " + error.message,
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: { model: Job },
    });

    if (!company) {
      return res.status(404).json({ success: false, msg: "Company not found" });
    }

    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error retrieving company: " + error.message,
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!company) {
      return res.status(404).json({ success: false, msg: "Company not found" });
    }

    await company.update(req.body);

    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating company: " + error.message,
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const deleted = await Company.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!deleted) {
      return res.status(404).json({ success: false, msg: "Company not found" });
    }

    res.status(200).json({ success: true, msg: "Company deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deleting company: " + error.message,
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
