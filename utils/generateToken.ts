import jwt from "jsonwebtoken";
import config from "../config";

export default (userId: string): string => {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60 * 7),
    data: { userId: userId }
  }, config.app.jwtSecret);
}
