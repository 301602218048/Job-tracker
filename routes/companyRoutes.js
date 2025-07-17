const express = require("express");
const companyController = require("../controllers/companyController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/", auth.authenticate, companyController.createCompany);
router.get("/", auth.authenticate, companyController.getCompanies);
router.get("/:id", auth.authenticate, companyController.getCompanyById);
router.patch("/:id", auth.authenticate, companyController.updateCompany);
router.delete("/:id", auth.authenticate, companyController.deleteCompany);

module.exports = router;
