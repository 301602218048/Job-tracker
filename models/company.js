const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Company = sequelize.define(
  "companys",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    industry: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Company;
