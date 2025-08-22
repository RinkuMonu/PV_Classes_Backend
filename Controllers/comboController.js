const Combo = require("../Models/Combo");
exports.createCombo = async (req, res) => {
  try {
    const combo = new Combo(req.body);
    await combo.save();
    res.status(201).json({ success: true, combo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📌 Get All Combos
exports.getAllCombos = async (req, res) => {
  try {
    let combos = await Combo.find()
      .populate("courses")
      .populate("books")
      .populate("pyqs")
      .populate("testSeries");

    combos = combos.map((combo) => {
      let totalOriginalPrice = 0;

      // Saare items ka price add karna
      if (combo.courses?.length) {
        totalOriginalPrice += combo.courses.reduce(
          (acc, course) => acc + (course.price || 0),
          0
        );
      }
      if (combo.books?.length) {
        totalOriginalPrice += combo.books.reduce(
          (acc, book) => acc + (book.price || 0),
          0
        );
      }
      if (combo.pyqs?.length) {
        totalOriginalPrice += combo.pyqs.reduce(
          (acc, pyq) => acc + (pyq.price || 0),
          0
        );
      }
      if (combo.testSeries?.length) {
        totalOriginalPrice += combo.testSeries.reduce(
          (acc, test) => acc + (test.price || 0),
          0
        );
      }

      // Final discounted price
      let finalPrice = totalOriginalPrice;
      if (combo.discountPercent && combo.discountPercent > 0) {
        finalPrice =
          totalOriginalPrice -
          (totalOriginalPrice * combo.discountPercent) / 100;
      }

      return {
        ...combo.toObject(),
        totalOriginalPrice,
        finalPrice,
      };
    });

    res.json({ success: true, combos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get Combo By ID
exports.getComboById = async (req, res) => {
  try {
    let combo = await Combo.findById(req.params.id)
      .populate("courses")
      .populate("books")
      .populate("pyqs")
      .populate("testSeries");

    if (!combo) {
      return res
        .status(404)
        .json({ success: false, message: "Combo not found" });
    }

    let totalOriginalPrice = 0;

    if (combo.courses?.length) {
      totalOriginalPrice += combo.courses.reduce(
        (acc, course) => acc + (course.price || 0),
        0
      );
    }
    if (combo.books?.length) {
      totalOriginalPrice += combo.books.reduce(
        (acc, book) => acc + (book.price || 0),
        0
      );
    }
    if (combo.pyqs?.length) {
      totalOriginalPrice += combo.pyqs.reduce(
        (acc, pyq) => acc + (pyq.price || 0),
        0
      );
    }
    if (combo.testSeries?.length) {
      totalOriginalPrice += combo.testSeries.reduce(
        (acc, test) => acc + (test.price || 0),
        0
      );
    }

    let finalPrice = totalOriginalPrice;
    if (combo.discountPercent && combo.discountPercent > 0) {
      finalPrice =
        totalOriginalPrice - (totalOriginalPrice * combo.discountPercent) / 100;
    }

    res.json({
      success: true,
      combo: {
        ...combo.toObject(),
        totalOriginalPrice,
        finalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update Combo
exports.updateCombo = async (req, res) => {
  try {
    const combo = await Combo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!combo) {
      return res
        .status(404)
        .json({ success: false, message: "Combo not found" });
    }
    res.json({ success: true, combo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📌 Delete Combo
exports.deleteCombo = async (req, res) => {
  try {
    const combo = await Combo.findByIdAndDelete(req.params.id);
    if (!combo) {
      return res
        .status(404)
        .json({ success: false, message: "Combo not found" });
    }
    res.json({ success: true, message: "Combo deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};