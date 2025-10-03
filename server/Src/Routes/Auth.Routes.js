import express from "express";
import {signup , login , logout , checkAuth} from "../Controllers/Auth.js"
import { authMiddleware } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected route
router.get("/check-auth", authMiddleware, checkAuth);

export default router;
