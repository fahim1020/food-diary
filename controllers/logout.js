const logout = (req, res) => {
  res.cookie("auth", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
module.exports = logout;
