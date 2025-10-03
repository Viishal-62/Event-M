 import { decodeToken } from "../Utils/Tokens.js";
 import { Creator } from "../Model/CreatorModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Decode / verify token
    const decoded = decodeToken(token); // should return payload { id }
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    //  Fetch user from DB
    const user = await Creator.findById(decoded.id);

    console.log("login user is : " , user)
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
     
    const {password , ...rest} = user.toObject();
    //  Attach user to request
    req.user = rest;

    next(); // pass control to next middleware / route
  } catch (error) {
    console.error("❌ Error in authMiddleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
