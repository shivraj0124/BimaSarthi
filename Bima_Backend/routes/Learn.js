const express = require("express");
const router = express.Router();
const learnController = require("../controllers/LearnController");

router.post("/", learnController.createLearn);
router.get("/", learnController.getAllLearn);
router.get("/:id", learnController.getSingleLearn);
router.put("/:id", learnController.updateLearn);
router.delete("/:id", learnController.deleteLearn);

module.exports = router;
