import { Hono } from "hono";
import { checkToken, getCurrentUser } from "../controllers/auth.controller.js";

const router = new Hono();

router.post("/check-token", checkToken);
router.get("/me", getCurrentUser);

export default router;
