const Book = require("../Models/Book");

// ✅ Create Book
exports.createBook = async (req, res) => {
  try {
    const {
      book_category_id,
      book_subcategory_id,
      status,
      tag,
      book_title,
      book_description,
      price,
      discount_price,
      stock,
      book_key_features,
    } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path);
    }

    const newBook = new Book({
      book_category_id,
      book_subcategory_id,
      status,
      tag: tag ? tag.split(",") : [],
      book_title,
      book_description,
      price,
      discount_price,
      stock,
    book_key_features: book_key_features ? JSON.parse(book_key_features) : [],
      images,
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      message: "Book created successfully",
      data: savedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating book",
      error: error.message,
    });
  }
};

// ✅ Get All Books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("book_category_id", "name")
      .populate("book_subcategory_id", "name");

    res.status(200).json({
      message: "Books fetched successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books",
      error: error.message,
    });
  }
};
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book fetched successfully", data: book });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error: error.message });
  }
};
exports.getBooksByCategoryId = async (req, res) => {
  try {
    const books = await Book.find({ book_category_id: req.params.categoryId });
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found in this category" });
    }
    res.status(200).json({ message: "Books fetched successfully", data: books });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
};
// ✅ Update Book
exports.updateBook = async (req, res) => {
  try {
    const {
      book_category_id,
      book_subcategory_id,
      status,
      tag,
      book_title,
      book_description,
      price,
      discount_price,
      stock,
      book_key_features,
    } = req.body;

    let updateData = {
      book_category_id,
      book_subcategory_id,
      status,
      tag: tag ? tag.split(",") : [],
      book_title,
      book_description,
      price,
      discount_price,
      stock,
      book_key_features: book_key_features
        ? book_key_features.split(",")
        : [],
    };

    // If new images are uploaded, replace them
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path);
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating book",
      error: error.message,
    });
  }
};

// ✅ Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting book",
      error: error.message,
    });
  }
};
