const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {addCourseCategory,getCourseCategory,updateCourseCategory,getCourseCategoryData} = require("../Controllers/CourseCategoryController");
router.post("/add-course-category",auth,addCourseCategory);
router.get("/get-course-category",auth,getCourseCategory);
router.get("/get-course-category-data",auth,getCourseCategoryData);
router.put("/update-course-category",auth,updateCourseCategory);

module.exports = router;