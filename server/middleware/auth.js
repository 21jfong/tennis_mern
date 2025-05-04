import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const isCustomAuth = token.length < 500;

    if (token && isCustomAuth) {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedData?.id;
    } else {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const user = await User.findOne({ email: payload.email });
      req.userId = user.id.toString();
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(403).json({ message: "Authentication failed" });
  }
};

export default auth;
