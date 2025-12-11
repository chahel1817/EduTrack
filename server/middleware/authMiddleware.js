import jwt from "jsonwebtoken";

/* --------------------------------------------------------
   AUTHENTICATE USER (Verify JWT)
-------------------------------------------------------- */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // No auth header
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided, access denied" });
    }

    // Token must start with "Bearer <token>"
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing, access denied" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

/* --------------------------------------------------------
   AUTHORIZE USER (Role-based)
-------------------------------------------------------- */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access forbidden: insufficient privileges" });
      }

      next();
    } catch (error) {
      console.error("Authorization Error:", error.message);
      return res.status(500).json({ message: "Authorization failed" });
    }
  };
};
