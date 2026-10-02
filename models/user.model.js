import mongoose from "mongoose";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { kMaxLength } from "buffer";
import { match } from "assert";
import { type } from "os";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot be exceed 50 character"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please provide a valid emaiil"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
    minLength: [8, "Password must be atleast 8 character"],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ["student", "instructor", "admin"],
      message: "Please select a valid role",
    },
    default: "student",
  },
  avatar: {
    type: String,
    default: "default-avatar.png",
  },
  bio: {
    type: String,
    maxlength: [200, "Bio cannot exceed 200 character"],
  },
  enrolledCourses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      enrolledAt: {
        type: Date.now(),
      },
    },
  ],
  createdCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  resetPasswordToken: String,
  resetPasswordToken: Date,
  lastActive: {
        type: Date,
        default:Date.now
  }
}, {
    timestamps: true
});

//hashing the password
userSchema.pre('save',async)


export const User = mongoose.model('User', userSchema)