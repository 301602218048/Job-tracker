const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const ArchivedJob = sequelize.define(
  "archivedjob",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobTitle: {
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
      type: DataTypes.STRING,
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

module.exports = ArchivedJob;
