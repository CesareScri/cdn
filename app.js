import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Initialize express and set a port
const app = express();
const port = 3000;

app.use("/cdn", express.static("cdn"));
app.use(cors());
app.use(express.static("public"));
// Set up multer for storing uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "cdn/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Construct the URL for the uploaded file
    const fileUrl = `http://${req.headers.host}/cdn/${req.file.filename}`;

    // Send the file URL as response
    res.status(200).json({ fileUrl: fileUrl, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
