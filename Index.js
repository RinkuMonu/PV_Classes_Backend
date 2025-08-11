require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Db/db");
const userRoute = require("./Routes/User");
const app = express();
app.use(cors());
// server.js
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use("/api/users",userRoute);
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
