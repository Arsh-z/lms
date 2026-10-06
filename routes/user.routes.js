import express from "express";
import { authenticateUser, createUserAccount, signOutUser } from "../controllers/user.controller";


const router = express.Router();


//auth routes
router.post("/signup", createUserAccount);
router.post("/sign-in", authenticateUser);
router.post("/signout", signOutUser);


//Profile route
router.get("/profile", getCurrentUserProfile);

export default router;
