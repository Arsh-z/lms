import generateToken from "../database/generateToken.js";
import { catchAsync } from "../middleware/error.middleware.js";
import User from "../models/user.model.js";


export const createUserAccount = catchAsync(async (req, res) => {
    const { name, email, password, role = "student" } = req.body;
    
    //will do validation here

  // Check if user already exists
  const existingUser = await User.findOne({ email:email.toLowerCase()});

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  // Create new user
  const user = await User.create({
    name,
    email:email.toLowerCase(),
    password,
    role,
  });

    await user.updateLastActive();
    generateToken(res, user, 'Account created Successfully');
    

});
