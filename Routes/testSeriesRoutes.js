// Routes/testSeriesRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const testSeriesController = require("../Controllers/testSeriesController");
const verifyToken = require("../middleware/auth");

// Create series
router.post(
  "/",
  upload("testSeries").array("images", 5),
  testSeriesController.createTestSeries
);



// Read
router.get("/",testSeriesController.getAllTestSeries);
router.get("/exam/:examId", testSeriesController.getByExam);
router.get("/:id", testSeriesController.getTestSeriesById);
router.get("/ranking/:testSeriesId/:testId/:attemptId", verifyToken, testSeriesController.getRanking);
// Update (FIXED field name)
router.put(
  "/:id",
  upload("testSeries").array("images", 5),
  testSeriesController.updateTestSeries
);

// Delete
router.delete("/:id", testSeriesController.deleteTestSeries);
router.delete("/delete-test/:seriesId/:testId", verifyToken, testSeriesController.deleteEmbeddedTest);
/* ---------- Admin helpers (same model) ---------- */
// Add a test into a series
router.post("/:seriesId/tests", testSeriesController.addEmbeddedTest);


// Add questions (bulk) into embedded test
// body: { questions: [ { type, statement, options?, correctOptions?, correctNumeric?, marks?, negativeMarks? ... } ] }
router.post("/:seriesId/tests/:testId/questions",verifyToken,  testSeriesController.addQuestionsToEmbeddedTest);

// Delete question from embedded test
router.delete("/:seriesId/tests/:testId/questions/:questionId", verifyToken, testSeriesController.deleteQuestionFromEmbeddedTest);

/* ---------- Daily-quiz / one-by-one flow ---------- */
// Start attempt
router.post("/:seriesId/tests/:testId/start",verifyToken,  testSeriesController.startEmbeddedTest);

// Current question (resume)
router.get("/:seriesId/attempts/:attemptId/current",verifyToken,  testSeriesController.getCurrentEmbedded);

// Answer & Next
router.post("/:seriesId/attempts/:attemptId/answer",verifyToken, testSeriesController.answerEmbeddedCurrent);

// Finish now
router.post("/:seriesId/attempts/:attemptId/finish",verifyToken, testSeriesController.finishEmbeddedAttempt);
router.get("/get-answer-sheet/:id",verifyToken, testSeriesController.getAnswerSheet);
module.exports = router;
