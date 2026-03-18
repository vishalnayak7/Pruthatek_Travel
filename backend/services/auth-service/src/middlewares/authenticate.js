import jwt from "jsonwebtoken";
import { LOGOUT_TOKEN_MODEL } from "../modules/auth/logoutToken.model.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Check blacklist
    const blacklisted = await LOGOUT_TOKEN_MODEL.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request
    req.user = { id: decoded.id, role: decoded.role }; // role optional

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authenticate;