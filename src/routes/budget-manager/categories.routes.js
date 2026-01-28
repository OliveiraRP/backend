import { Hono } from "hono";
import {
  fetchAllCategories,
  fetchCategoryGroups,
  createNewCategory,
  createNewCategoryGroup,
} from "../../controllers/budget-manager/categories.controller.js";

const router = new Hono();

router.get("/", fetchAllCategories);
router.post("/", createNewCategory);
router.get("/groups", fetchCategoryGroups);
router.post("/groups", createNewCategoryGroup);

export default router;
