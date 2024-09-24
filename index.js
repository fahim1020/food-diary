// External modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
//Internal modules
const router = require("./routes/route.js");
const dbConnect = require("./config/dbConnect.js");
const fileRender = require("./render/fileRender.js");

const app = express();

// Middleware
app.use(express.json());
dotenv.config();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
dbConnect();

// Routes
app.use("/api", router);
app.use("/", fileRender);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
