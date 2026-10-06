import generateToken from "../database/generateToken.js";
import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import User from "../models/user.model.js";

export const createUserAccount = catchAsync(async (req, res) => {
  const { name, email, password, role = "student" } = req.body;

  //will do validation here

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  // Create new user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
  });

  await user.updateLastActive();
  generateToken(res, user, "Account created Successfully");
});

export const authenticateUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = User.findOne({ email: email.toLowerCase() }).select("password");

  if (!user || (await user.comparePassword(password))) {
    throw new ApiError("Invalid email or password");
  }

  await user.updateLastActive();
  generateToken(res, user, `Login successful${user.name}`);
});

export const signOutUser = catchAsync(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getCurrentUserProfile = catchAsync(async (req, res) => {
    const user = User.findById(req.id)
        .populate({
            path: "enrolledCourses.course",
            select: 'title thumbnail description'
        })
    
    if (!user) {
        throw new ApiError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        data: {
            ...user.toJSON(),
            totalEnrolledCourses: user.totalEnrolledCourses,
        }
    })
});