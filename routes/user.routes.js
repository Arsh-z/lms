import express from "express";
import { authenticateUser, createUserAccount, signOutUser, getCurrentUserProfile, updateUserProfile } from "../controllers/user.controller";

import upload from "../database/multer";

import { isAuthenticated } from "../middleware/auth.middleware";
import { validateSignUp } from "../middleware/validation.middleware";
upload


const router = express.Router(); \



//auth routes
router.post("/signup", validateSignUp,createUserAccount);
router.post("/sign-in", authenticateUser);
router.post("/signout", signOutUser);




//Profile route
router.get("/profile",
    isAuthenticated,
    getCurrentUserProfile
);
router.get(
  "/courses",
  validate(commonValidation.pagination),
  getCourses
);

//user id
router.get(
  "/users/:id",
  validate([commonValidation.mongoId]),
  getUser
);

router.patch("/profile",
    isAuthenticated,
    upload.single("avatr"),
    updateUserProfile);


export default router;


