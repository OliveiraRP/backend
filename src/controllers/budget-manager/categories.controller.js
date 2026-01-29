import {
  getAllCategories,
  createCategory,
  getAllCategoryGroups,
  createCategoryGroup,
} from "../../repositories/budget-manager/categories.repository.js";
import { getDb } from "../../config/db.js";

export async function fetchAllCategories(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const categories = await getAllCategories(db, userId);
    return c.json(categories);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
}

export async function fetchCategoryGroups(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const groups = await getAllCategoryGroups(db, userId);
    return c.json(groups);
  } catch (err) {
    return c.json({ error: "Failed to fetch groups" }, 500);
  }
}

export async function createNewCategory(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const { category_group_id, name, icon, excludeFromOverview } =
      await c.req.json();
    const category = await createCategory(db, userId, {
      category_group_id,
      name,
      icon,
      excludeFromOverview,
    });
    return c.json(category, 201);
  } catch (err) {
    return c.json({ error: "Failed to create category" }, 500);
  }
}

export async function createNewCategoryGroup(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const { name, type, color } = await c.req.json();
    const group = await createCategoryGroup(db, userId, {
      name,
      type,
      color,
    });
    return c.json(group, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to create category group" }, 500);
  }
}
