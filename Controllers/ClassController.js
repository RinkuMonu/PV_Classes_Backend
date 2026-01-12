const { getRtcToken, getRtmToken } = require("../Services/agoraToken.service");
const LiveSession = require("../Models/LiveSession.model");
const LiveParticipant = require("../Models/LiveParticipant.model");
const YouTubeClass = require("../Models/YouTubeClass.model");

exports.joinLiveClass = async (req, res) => {
  try {
    const { classId, userId, role } = req.body;

    const channelName = `class_${classId}`;
    const uid = Number(userId);

    // 🔹 Create or find live session
    let liveSession = await LiveSession.findOne({ classId });

    if (!liveSession && role === "teacher") {
      liveSession = await LiveSession.create({
        classId,
        channelName,
        startedBy: uid,
      });
    }


    // 🔹 Save participant join
    await LiveParticipant.create({
      classId,
      userId: uid,
      role,
    });

    const rtcToken = getRtcToken({ channelName, uid, role });
    const rtmToken = getRtmToken({ uid });

    res.json({
      success: true,
      appId: process.env.AGORA_APP_ID,
      channelName,
      uid,
      role,
      rtcToken,
      rtmToken,
    });
  } catch (err) {
    console.error("Join live class error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to join live class",
      error: err.message,
    });
  }
};

// In your backend controller
exports.leaveLiveClass = async (req, res) => {
  try {
    const { classId, userId, role } = req.body;

    // Update participant left time
    await LiveParticipant.findOneAndUpdate(
      { classId, userId, leftAt: null },
      { leftAt: Date.now() }
    );

    // Check if all teachers left - end session
    const activeTeachers = await LiveParticipant.countDocuments({
      classId,
      role: 'teacher',
      leftAt: null
    });

    if (activeTeachers === 0) {
      await LiveSession.findOneAndUpdate(
        { classId },
        { status: 'ended', endedAt: Date.now() }
      );
    }

    res.json({
      success: true,
      message: 'Successfully left the class'
    });
  } catch (err) {
    console.error('Leave live class error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to leave class'
    });
  }
};

exports.getActiveSessions = async (req, res) => {
  try {
    const activeSessions = await LiveSession.find({
      status: 'live'
    }).populate('participants');

    res.json({
      success: true,
      data: activeSessions
    });
  } catch (err) {
    console.error('Get active sessions error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get active sessions'
    });
  }
};

exports.createYouTubeClass = async (req, res) => {
  try {
    const { title, description, youtubeUrl, classId, orderId, courseId, topicId } = req.body;

    const newClass = await YouTubeClass.create({
      title,
      description,
      youtubeUrl,
      classId,
      orderId,
      courseId,
      topicId,
    });

    res.status(201).json({
      success: true,
      message: "YouTube class created successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create YouTube class",
      error: error.message,
    });
  }
};

exports.getYouTubeClasses = async (req, res) => {
  try {
    const { classId } = req.query;

    const filter = {};
    if (classId) filter.classId = classId;

    const data = await YouTubeClass.find(filter).sort({ orderId: 1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch YouTube classes",
      error: error.message,
    });
  }
};

exports.getClassesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const classes = await YouTubeClass.find({ topicId })
      .sort({ orderId: 1 });

    res.json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes by topic",
      error: error.message,
    });
  }
};

exports.getYouTubeClassById = async (req, res) => {
  try {
    const data = await YouTubeClass.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "YouTube class not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch YouTube class",
      error: error.message,
    });
  }
};

exports.updateYouTubeClass = async (req, res) => {
  try {
    const updated = await YouTubeClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "YouTube class not found",
      });
    }

    res.json({
      success: true,
      message: "YouTube class updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update YouTube class",
      error: error.message,
    });
  }
};

exports.deleteYouTubeClass = async (req, res) => {
  try {
    const deleted = await YouTubeClass.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "YouTube class not found",
      });
    }

    res.json({
      success: true,
      message: "YouTube class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete YouTube class",
      error: error.message,
    });
  }
};