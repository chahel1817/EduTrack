import jwt from "jsonwebtoken";
import User from "../models/User.js";
import redis from "../config/redis.js";

export const authenticate = async (req, res, next) => {
  let token;

  // Expect: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 🚨 CHECK REDIS BLACKLIST 🚨
      const isBlacklisted = await redis.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return res.status(401).json({ success: false, message: "Session expired, please login again" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      req.token = token; // Store token for logout

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    next();
  };
};
