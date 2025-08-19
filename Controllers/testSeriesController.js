const TestSeries = require("../Models/TestSeries");
// Create
exports.createTestSeries = async (req, res) => {
  try {
    const {
      exam_id,
      title,
      title_tag,
      description,
      price,
      discount_price,
      validity,
      total_tests,
      is_active
    } = req.body;

    // subjects agar string aayi hai to parse karo
    let subjects = [];
    if (req.body.subjects) {
      try {
        subjects = JSON.parse(req.body.subjects);
      } catch (e) {
        return res.status(400).json({ error: "Invalid JSON format for subjects" });
      }
    }

    // multer se images ka path
   let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    const testSeries = await TestSeries.create({
      exam_id,
      title,
      title_tag,
      description,
      price,
      discount_price,
      validity,
      total_tests,
      subjects,
      is_active,
      images
    });

    res.status(201).json({
      success: true,
      message: "Test Series created successfully",
      data: testSeries
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// Get all
exports.getAllTestSeries = async (req, res) => {
  try {
    const testSeriesList = await TestSeries.find()
      .populate("exam_id", "name")
      .sort({ createdAt: -1 });

    if (!testSeriesList || testSeriesList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Test Series found"
      });
    }

    // Group by exam_id
    const groupedData = testSeriesList.reduce((acc, series) => {
      const examId = series.exam_id?._id?.toString();
      const examName = series.exam_id?.name || "Unknown Exam";

      if (!acc[examId]) {
        acc[examId] = {
          exam_id: examId,
          exam_name: examName,
          series: []
        };
      }

      acc[examId].series.push(series.toJSON());
      return acc;
    }, {});
    res.status(200).json({
      success: true,
      message: "Test Series fetched successfully",
      data: Object.values(groupedData)
    });

  } catch (err) {
    console.error("Error fetching test series:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};


// Get by Exam
exports.getByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const series = await TestSeries.find({ exam_id: examId })
      .populate("exam_id", "name")
      .sort({ createdAt: -1 });

    if (!series || series.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Test Series found for the given exam"
      });
    }

    res.status(200).json({
      success: true,
      message: "Test Series fetched successfully for the given exam",
      data: series
    });
  } catch (err) {
    console.error("Error fetching test series by exam:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};
// Get by ID
exports.getTestSeriesById = async (req, res) => {
  try {
    const series = await TestSeries.findById(req.params.id)
      .populate("exam_id", "name");

    if (!series) {
      return res.status(404).json({
        success: false,
        message: "Test Series not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Test Series fetched successfully",
      data: series
    });
  } catch (err) {
    console.error("Error fetching test series by ID:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};
// Update
exports.updateTestSeries = async (req, res) => {
  try {
    const {
      exam_id,
      title,
      title_tag,
      description,
      price,
      discount_price,
      validity,
      total_tests,
      is_active
    } = req.body;

    // Parse subjects if provided as JSON string
    let subjects;
    if (req.body.subjects) {
      try {
        subjects = JSON.parse(req.body.subjects);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for subjects"
        });
      }
    }

    // Handle uploaded images
    let imagePaths;
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/testSeries/${file.filename}`);
    }

    // Prepare update data
    const updateData = {
      exam_id,
      title,
      title_tag,
      description,
      price,
      discount_price,
      validity,
      total_tests,
      is_active
    };

    if (subjects) updateData.subjects = subjects;
    if (imagePaths) updateData.images = imagePaths;

    const series = await TestSeries.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!series) {
      return res.status(404).json({
        success: false,
        message: "Test Series not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Test Series updated successfully",
      data: series
    });

  } catch (err) {
    console.error("Error updating Test Series:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};
// Delete
exports.deleteTestSeries = async (req, res) => {
  try {
    const series = await TestSeries.findByIdAndDelete(req.params.id);
    if (!series) return res.status(404).json({ error: "Test Series not found" });
    res.json({ message: "Test Series deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
