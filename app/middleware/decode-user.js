import jwt from "jsonwebtoken";
import config from "../config.js";

export default function decodeUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  // This will either stay undefined or be set to the decoded token
  let decodedToken;

  if (token) {
    decodedToken = jwt.verify(token, config.jwtSecret);
  }

  // If we get the user info from the token, set it on the request
  req.user = decodedToken?.user;

  next();
}
