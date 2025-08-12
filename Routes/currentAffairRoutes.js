const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  createCurrentAffair,
  getCurrentAffairs,
  getCurrentAffairBySlug
} = require("../Controllers/currentAffairController");

// Category Routes
router.post("/categories", createCategory);
router.get("/categories", getCategories);

// Blog Routes
router.post("/", createCurrentAffair);
router.get("/", getCurrentAffairs);
router.get("/:slug", getCurrentAffairBySlug);

module.exports = router;
