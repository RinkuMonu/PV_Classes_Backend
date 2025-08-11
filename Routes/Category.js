const express = require("express");
const router = express.Router();
const categoryController = require("../Controllers/Category");

// Create
router.post("/", categoryController.createCategory);

// Read all
router.get("/", categoryController.getCategories);

// Read by ID
router.get("/:id", categoryController.getCategoryById);

// Update
router.put("/:id", categoryController.updateCategory);

// Delete
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
