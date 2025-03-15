const { verifyToken } = require("../utils/authUtils");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.authToken; // Get token from cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    const decoded = await verifyToken(token); // If verifyToken is async, use await

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
  if (req.user.role.role_name !== "Admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  next(); // If user is an admin, proceed to the next middleware/route handler
};

module.exports = { authMiddleware, isAdmin };
