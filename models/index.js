const User = require("./user");
const Job = require("./job");
const Profile = require("./profile");
const Company = require("./company");

Company.hasMany(Job);
Job.belongsTo(Company);

User.hasMany(Company);
Company.belongsTo(User);

User.hasOne(Profile);
Profile.belongsTo(User);

User.hasMany(Job);
Job.belongsTo(User);

module.exports = {
  User,
  Job,
  Profile,
  Company,
};
