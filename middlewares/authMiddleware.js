const { verifyToken } = require("../utils/authUtils");

const authMiddleware = (req, res, next) => {
  const cookieToken = req.cookies?.authToken;
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // Store decoded token in req.user
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(500).json({ message: "Token verification failed" });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  // Check the role or permission of the user
  if (!req.user || req.user.roleName !== "Admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  next(); // If user is an admin, proceed to the next middleware/route handler
};

module.exports = { authMiddleware, isAdmin };
