const { verifyToken } = require("../utils/authUtils");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken; // Get token from cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: "Invalid token" });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
