import express from "express";
import {
  fetchAllCategories,
  fetchCategoryGroups,
  createNewCategory,
  createNewCategoryGroup,
} from "../../controllers/budget-manager/categories.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, fetchAllCategories);
router.post("/", authMiddleware, createNewCategory);
router.get("/groups", authMiddleware, fetchCategoryGroups);
router.post("/groups", authMiddleware, createNewCategoryGroup);

export default router;
