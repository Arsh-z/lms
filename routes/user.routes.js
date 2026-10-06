import express from "express";
import { authenticateUser, createUserAccount, signOutUser, getCurrentUserProfile, updateUserProfile } from "../controllers/user.controller";

import upload from "../database/multer";

import { isAuthenticated } from "../middleware/auth.middleware";
upload


const router = express.Router();


//auth routes
router.post("/signup", createUserAccount);
router.post("/sign-in", authenticateUser);
router.post("/signout", signOutUser);


//Profile route
router.get("/profile",
    isAuthenticated,
    getCurrentUserProfile
);

router.patch("/profile",
    isAuthenticated,
    upload.single("avatr"),
    updateUserProfile);


export default router;


