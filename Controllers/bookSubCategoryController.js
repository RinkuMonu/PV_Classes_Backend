const BookSubCategory = require("../Models/BookSubCategory");
const BookCategory = require("../Models/BookCategory");
exports.createSubCategory = async (req, res) => {
  try {
    const { name, book_category_id, status } = req.body;
    if (!name || !book_category_id) {
      return res.status(400).json({ message: "Name and book_category_id are required" });
    }
    const categoryExists = await BookCategory.findById(book_category_id);
    if (!categoryExists) {
      return res.status(404).json({ message: "Book category not found" });
    }
    const subCategory = new BookSubCategory({
      name,
      book_category_id,
      status: status || "active"
    });
    await subCategory.save();
    res.status(201).json({
      message: "Subcategory created successfully",
      data: subCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await BookSubCategory.find();
    res.status(200).json({ data: subCategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, book_category_id, status } = req.body;

    // Prepare the update object
    const updateData = {};
    if (name) updateData.name = name;
    if (book_category_id) updateData.book_category_id = book_category_id;
    if (status) updateData.status = status;

    const subCategory = await BookSubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json({
      message: "Subcategory updated successfully",
      data: subCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await BookSubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
