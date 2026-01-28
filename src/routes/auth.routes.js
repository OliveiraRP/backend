import express from "express";
import { checkToken, getCurrentUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/check-token", checkToken);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
