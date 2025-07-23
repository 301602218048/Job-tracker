const express = require("express");
const path = require("path");
const db = require("./utils/db-connection");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const profileRoutes = require("./routes/profileRoutes");
const companyRoutes = require("./routes/companyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

require("dotenv").config();
require("./models");
require("./utils/reminder");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/user", userRoutes);
app.use("/job", jobRoutes);
app.use("/profile", profileRoutes);
app.use("/company", companyRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "signup.html"));
});

const port = process.env.PORT || 3000;
db.sync({ alter: false })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
