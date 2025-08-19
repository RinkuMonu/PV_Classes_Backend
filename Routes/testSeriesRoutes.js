// Routes/testSeriesRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const testSeriesController = require("../Controllers/testSeriesController");


// Create series
router.post(
  "/",
  upload("testSeries").array("images", 5),
  testSeriesController.createTestSeries
);

// Read
router.get("/", testSeriesController.getAllTestSeries);
router.get("/exam/:examId", testSeriesController.getByExam);
router.get("/:id", testSeriesController.getTestSeriesById);

// Update (FIXED field name)
router.put(
  "/:id",
  upload("testSeries").array("images", 5),
  testSeriesController.updateTestSeries
);

// Delete
router.delete("/:id", testSeriesController.deleteTestSeries);

/* ---------- Admin helpers (same model) ---------- */
// Add a test into a series
router.post("/:seriesId/tests", testSeriesController.addEmbeddedTest);

// Add questions (bulk) into embedded test
// body: { questions: [ { type, statement, options?, correctOptions?, correctNumeric?, marks?, negativeMarks? ... } ] }
router.post("/:seriesId/tests/:testId/questions",  testSeriesController.addQuestionsToEmbeddedTest);

/* ---------- Daily-quiz / one-by-one flow ---------- */
// Start attempt
router.post("/:seriesId/tests/:testId/start",  testSeriesController.startEmbeddedTest);

// Current question (resume)
router.get("/:seriesId/attempts/:attemptId/current",  testSeriesController.getCurrentEmbedded);

// Answer & Next
router.post("/:seriesId/attempts/:attemptId/answer",  testSeriesController.answerEmbeddedCurrent);

// Finish now
router.post("/:seriesId/attempts/:attemptId/finish", testSeriesController.finishEmbeddedAttempt);

module.exports = router;
