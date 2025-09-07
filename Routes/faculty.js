const express = require("express");
const router = express.Router();
const facultyController = require("../Controllers/faculty");
const upload = require("../middleware/upload");
const uploadImg = upload("faculty");

router.post("/", uploadImg.single("photo"), facultyController.createFaculty);
router.get("/", facultyController.getAllFaculty);
router.post("/add-to-course", facultyController.addFacultyToCourse);
router.delete("/:id", facultyController.deleteFaculty);


module.exports = router;