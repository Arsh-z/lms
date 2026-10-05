import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError, catchAsync } from "./error.middleware.js";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError("Authentication required");
  }

    try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.id = decoded.userId;
        next()
    
    } catch (error) {
        throw new ApiError("JWT Token error", 401)
    }
 
});
