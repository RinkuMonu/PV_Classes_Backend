const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const testSeriesController = require("../Controllers/testSeriesController");

// yaha folderPath pass karo => "testSeries"
router.post(
  "/",
  upload("testSeries").array("images", 5),
  testSeriesController.createTestSeries
);


router.get("/", testSeriesController.getAllTestSeries);
router.get("/exam/:examId", testSeriesController.getByExam);
router.get("/:id", testSeriesController.getTestSeriesById);

router.put(
  "/:id",
  upload("testSeries").array("testSeries", 5),
  testSeriesController.updateTestSeries
);

router.delete("/:id", testSeriesController.deleteTestSeries);

module.exports = router;
