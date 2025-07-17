const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Job = sequelize.define(
  "jobs",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    followupDate: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    resume: {
      type: DataTypes.STRING,
    },
    coverLetter: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Job;
