const express = require("express");
const fs = require("fs");
const mysql = require("mysql2");
const multer = require("multer");

const app = express();
const upload = multer({ dest: `uploads/` });

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "supermarket",
});

app.post(`/upload`, upload.single(`image`), (req, res) => {
  const { filename, mimetype, size } = req.file;

  const data = fs.readFileSync(req.file.path);

  connection.query(
    `INSERT INTO images (filename,mimetype,size,data) VALUES (?,?,?,?)`,
    [filename, mimetype, size, data],
    (error) => {
      if (error) {
        console.error("Error storing image:", error);
        res.status(500).json({ error: "Failed to store image" });
      } else {
        res.json({ message: "Image stored successfully" });
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
