require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Db/db");


const contactRoutes = require("./Routes/Contact");
const userRoute = require("./Routes/User");
const CourseCategoryRoute = require("./Routes/CourseCategory");

const categoriesRoute = require("./Routes/Category");
const CoursesRoute = require("./Routes/course");
const ExamTypeRoute = require("./Routes/examType");
const ExamRoute = require("./Routes/exam");
const wishlistRoutes = require("./Routes/wishlist");
const couponRoutes = require("./Routes/coupon");
const bookCategoryRoutes = require("./Routes/bookCategoryRoutes");
const bookSubCategoryRoutes = require("./Routes/BookSubCategory");
const booksRoutes = require("./Routes/bookRoutes");

const app = express();
app.use(cors());
// server.js
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use("/api/users", userRoute);
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/exam-types", ExamTypeRoute);
app.use("/api/exams", ExamRoute);
app.use("/api/course-category", CourseCategoryRoute);
app.use("/api/courses", CoursesRoute);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/book-categories", bookCategoryRoutes);
app.use("/api/book-sub-categories",bookSubCategoryRoutes);
app.use("/api/books",booksRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
