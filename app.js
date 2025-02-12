const express = require("express");
const app = express();
const cors = require("cors");
const errorLogger = require("./utilities/errorLogger");
const requestLogger = require("./utilities/requestLogger");
const router = require("./routes/routing");
const path = require("path");

app.use(cors());
app.use(express.json({ limit: "10mb" })); // Set a larger limit for JSON payloads
app.use(express.urlencoded({ limit: "500mb", extended: true }));
// Serve images from the "uploads" directory
const uploadsPath = path.join(__dirname, "..", "uploads");
// console.log("Serving static files from:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

app.use(requestLogger);

app.use(router);

app.all("*", (req, res, next) => {
  res.status(400).send("Sorry ! Page Not Found...");
});

app.use(errorLogger);

app.listen(3005, () => {
  console.log("Server started on port 3005");
});
