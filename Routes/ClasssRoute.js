const express = require("express");
const router = express.Router();
const { joinLiveClass,
    createYouTubeClass,
    getYouTubeClasses,
    getYouTubeClassById,
    updateYouTubeClass,
    deleteYouTubeClass,
    getClassesByTopic, } = require("../Controllers/ClassController");

router.post("/join", joinLiveClass);

router.post("/create", createYouTubeClass);

router.get("/all", getYouTubeClasses);

router.get("/:id", getYouTubeClassById);

router.get("/by-topic/:topicId", getClassesByTopic);


router.put("/:id", updateYouTubeClass);

router.delete("/:id", deleteYouTubeClass);

module.exports = router;