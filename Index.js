require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Db/db"); // ✅ CommonJS style import


const contactRoutes = require("./Routes/Contact");
const userRoute = require("./Routes/User");


const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/users", userRoute);
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
