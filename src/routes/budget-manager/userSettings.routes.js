import { Hono } from "hono";
import { fetchUserSettings } from "../../controllers/budget-manager/userSettings.controller.js";

const router = new Hono();

router.get("/", fetchUserSettings);

export default router;
