const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const token = req.cookies?.auth;

  if (!token) {
    if (req.path !== "/login" && req.path !== "/register") {
      return res.redirect("/login");
    }

    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (req.path === "/login" || req.path === "/register") {
      return res.redirect("/");
    }
    req.user = decoded;

    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = checkLogin;
