const express = require("express");
const router = express.Router();
const bookSubCategoryController = require("../Controllers/bookSubCategoryController");

router.post("/", bookSubCategoryController.createSubCategory);
router.get("/", bookSubCategoryController.getSubCategories);
router.put("/:id", bookSubCategoryController.updateSubCategory);
router.delete("/:id", bookSubCategoryController.deleteSubCategory);

module.exports = router;
