const express = require("express");
const router = express.Router();
const insuranceController = require("../controllers/InsuranceController");

router.post("/", insuranceController.createInsurance);
router.get("/", insuranceController.getAllInsurance);
router.get("/:id", insuranceController.getInsuranceById);
router.put("/:id", insuranceController.updateInsurance);
router.delete("/:id", insuranceController.deleteInsurance);

module.exports = router;
