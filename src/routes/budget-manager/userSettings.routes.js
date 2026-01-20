import express from "express";
import { fetchUserSettings } from "../../controllers/budget-manager/userSettings.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, fetchUserSettings);

export default router;
