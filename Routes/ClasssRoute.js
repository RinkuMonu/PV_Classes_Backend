const express = require("express");
const router = express.Router();
const { joinLiveClass,
    createYouTubeClass,
    getYouTubeClasses,
    getYouTubeClassById,
    updateYouTubeClass,
    deleteYouTubeClass, } = require("../Controllers/ClassController");

router.post("/join", joinLiveClass);

router.post("/create", createYouTubeClass);

router.get("/all", getYouTubeClasses);

router.get("/:id", getYouTubeClassById);

router.put("/:id", updateYouTubeClass);

router.delete("/:id", deleteYouTubeClass);

module.exports = router;