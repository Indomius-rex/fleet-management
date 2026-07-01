const jwt = require("jsonwebtoken");

// Middleware to verify JWT token from Authorization header
const authMiddleware = (req, res, next) => {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    // Extract token from "Bearer <token>" format
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
        success: false,
        message: "Invalid token format",
        });
        }

    const token = authHeader.split(" ")[1];

    // Check if token is empty
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store decoded userId in req.user for use in route handlers
    req.user = { userId: decoded.userId };

    // Call next middleware/route handler
    next();
  } catch (error) {
    // Handle token verification errors (invalid, expired, etc.)
    console.error("Auth middleware error:", error.message);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
