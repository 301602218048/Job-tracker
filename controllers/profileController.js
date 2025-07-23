const Profile = require("../models/profile");

const addCareerGoal = async (req, res) => {
  try {
    const { careerGoal, targetTitle, targetDate, minSalary, maxSalary } =
      req.body;
    const c = await Profile.findOne({ where: { userId: req.user.id } });
    if (c) {
      await Profile.update(req.body, {
        where: { userId: req.user.id },
      });
      return res
        .status(200)
        .json({ msg: "career goal updated successfully", success: true });
    }
    await Profile.create({
      careerGoal,
      targetTitle,
      targetDate,
      minSalary,
      maxSalary,
      userId: req.user.id,
    });
    res
      .status(201)
      .json({ msg: "career goal added successfully", success: true });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

const getCGoals = async (req, res) => {
  try {
    const cgoals = await Profile.findOne({ where: { userId: req.user.id } });
    if (!cgoals || cgoals.length === 0) {
      return res
        .status(204)
        .json({ msg: "No career goal found", success: false });
    }
    res
      .status(200)
      .json({ msg: "List of career goals", success: true, cgoals });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

module.exports = {
  addCareerGoal,
  getCGoals,
};
