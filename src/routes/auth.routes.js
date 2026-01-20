import express from "express";
import { checkToken, getCurrentUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/check-token", checkToken);
router.get("/me", getCurrentUser);

export default router;
