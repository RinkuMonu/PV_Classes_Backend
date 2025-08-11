require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Db/db");


const contactRoutes = require("./Routes/Contact");
const userRoute = require("./Routes/User");
const categoriesRoute = require("./Routes/Category");
const CoursesRoute = require("./Routes/course");
const ExamTypeRoute = require("./Routes/examType");
const ExamRoute = require("./Routes/exam");
const wishlistRoutes = require("./Routes/wishlist");
const couponRoutes = require("./Routes/coupon");

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
app.use("/api/courses", CoursesRoute);
app.use("/api/exam-types", ExamTypeRoute);
app.use("/api/exams", ExamRoute);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupon", couponRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
