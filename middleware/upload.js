const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Agar route ne subfolder diya hai to use karo, warna root uploads use karo
    const subFolder = req.subFolder || "";
    const dir = path.join(__dirname, "../uploads", subFolder);

    // Folder exist nahi karta to create karo
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
