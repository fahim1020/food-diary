const path = require("path");

function getFilePath(fileName) {
  return path.join(__dirname, "../pages", fileName);
}

module.exports = {
  getFilePath,
};
