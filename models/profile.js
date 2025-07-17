const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Profile = sequelize.define(
  "profiles",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    careerGoal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    minSalary: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    maxSalary: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Profile;
