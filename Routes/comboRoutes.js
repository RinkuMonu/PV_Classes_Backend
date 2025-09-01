const express = require("express");
const router = express.Router();
const comboController = require("../Controllers/comboController");

// CRUD Routes
router.post("/create", comboController.createCombo);
router.get("/", comboController.getAllCombos);
router.get("/:id", comboController.getComboById);
router.put("/:id", comboController.updateCombo);
router.delete("/:id", comboController.deleteCombo);

module.exports = router;
