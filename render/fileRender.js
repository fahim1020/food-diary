const express = require("express");
const { getFilePath } = require("../features/features");
const checkLogin = require("../middlewares/checkLogin");
const fileRender = express.Router();

// Serve home page
fileRender.get("/", checkLogin, (req, res) => {
  res.sendFile(getFilePath("index.html"));
});
fileRender.get("/login", checkLogin, (req, res) => {
  res.sendFile(getFilePath("login.html"));
});
fileRender.get("/register", checkLogin, (req, res) => {
  res.sendFile(getFilePath("register.html"));
});
fileRender.get("/market", checkLogin, (req, res) => {
  res.sendFile(getFilePath("marketList.html"));
});
fileRender.get("/overview", checkLogin, (req, res) => {
  res.sendFile(getFilePath("overview.html"));
});
fileRender.get("/setting", checkLogin, (req, res) => {
  res.sendFile(getFilePath("setting.html"));
});
fileRender.get("/about", checkLogin, (req, res) => {
  res.sendFile(getFilePath("about.html"));
});
fileRender.get("/contribute", checkLogin, (req, res) => {
  res.sendFile(getFilePath("contribute.html"));
});
fileRender.get("/get/navbar", checkLogin, (req, res) => {
  res.sendFile(getFilePath("navbar.html"));
});

fileRender.get("/share/:id", (req, res) => {
  res.sendFile(getFilePath("shareData.html"));
});
module.exports = fileRender;
