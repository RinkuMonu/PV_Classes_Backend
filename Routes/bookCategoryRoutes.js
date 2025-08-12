const express = require("express");
const router = express.Router();
const bookCategoryController = require("../Controllers/bookCategoryController");
const upload = require("../middleware/upload");

// Save images inside uploads/book/bookcategory
const uploadBookCategory = upload("book/bookcategory");
router.post("/", uploadBookCategory.single("image"), bookCategoryController.createCategory);
router.get("/", bookCategoryController.getCategories);
router.put("/:id", uploadBookCategory.single("image"), bookCategoryController.updateCategory);
router.delete("/:id", bookCategoryController.deleteCategory);

module.exports = router;
