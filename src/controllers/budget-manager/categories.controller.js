import {
  getAllCategories,
  createCategory,
  getAllCategoryGroups,
  createCategoryGroup,
} from "../../repositories/budget-manager/categories.repository.js";

export async function fetchAllCategories(req, res) {
  try {
    const categories = await getAllCategories(req.userId);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

export async function fetchCategoryGroups(req, res) {
  try {
    const groups = await getAllCategoryGroups(req.userId);
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
}

export async function createNewCategory(req, res) {
  try {
    const { category_group_id, name, icon, excludeFromOverview } = req.body;
    const category = await createCategory(req.userId, {
      category_group_id,
      name,
      icon,
      excludeFromOverview,
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
}

export async function createNewCategoryGroup(req, res) {
  try {
    const { name, type, color } = req.body;
    const group = await createCategoryGroup(req.userId, {
      name,
      type,
      color,
    });
    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create category group" });
  }
}
