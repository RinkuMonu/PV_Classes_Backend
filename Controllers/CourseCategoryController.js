const CourseCategory = require("../Models/CourseCategory");
const Category = require("../Models/Category");
const ExamType = require("../Models/ExamType");
const Exam = require("../Models/Exam");
exports.addCourseCategory = async (req, res) => {
  try {
    const { category_id, exam_type_id, exam_id } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!category_id || !exam_type_id || !exam_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newCourseCategory = await CourseCategory.create({
      user_id: req.user.id,
      category_id,
      exam_type_id,
      exam_id
    });
    return res.status(201).json({
      message: "Course category added successfully",
      data: newCourseCategory
    });
  } catch (error) {
    console.error("Error adding course category:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getCourseCategory = async (req, res) => { 
  try {
    const courseCategories = await CourseCategory.find({ user_id: req.user.id });

    if (!courseCategories.length) {
      return res.status(404).json({ message: "No course categories found" });
    }

    return res.status(200).json({
      message: "Course categories fetched successfully",
      data: courseCategories
    });

  } catch (error) {
    console.error("Error fetching course categories:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getCourseCategoryData = async (req, res) => {
  try {
    const courseCategories = await CourseCategory.find({ user_id: req.user.id })
      .populate("category_id")
      .populate("exam_type_id")
      .populate("exam_id");

    if (!courseCategories.length) {
      return res.status(404).json({ message: "No course category data found for this user" });
    }
    return res.status(200).json({
      message: "Course category data fetched successfully",
      data: courseCategories
    });
  } catch (error) {
    console.error("Error fetching course category data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.updateCourseCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category_id, exam_type_id, exam_id } = req.body;
    if (!category_id || !exam_type_id || !exam_id) {
      return res.status(400).json({ message: "category_id, exam_type_id and exam_id are required" });
    }
    const courseCategory = await CourseCategory.findOne({ user_id: userId });
    if (!courseCategory) {
      return res.status(404).json({ message: "Course category not found for this user" });
    }
    courseCategory.category_id = category_id;
    courseCategory.exam_type_id = exam_type_id;
    courseCategory.exam_id = exam_id;
    await courseCategory.save();
    return res.status(200).json({
      message: "Course category updated successfully",
      data: courseCategory
    });
  } catch (error) {
    console.error("Error updating course category:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
