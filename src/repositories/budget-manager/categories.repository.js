import { pool } from "../../config/db.js";

export async function getAllCategories(userId) {
  const result = await pool.query(
    `SELECT 
        c.id,
        c.category_group_id,
        c.name,
        c.icon,
        c.exclude_from_overview,
        cg.name as group_name,
        cg.color,
        cg.type as group_type
     FROM categories c
     JOIN category_groups cg ON c.category_group_id = cg.id
     WHERE cg.user_id = $1
     ORDER BY cg.name ASC, c.name ASC`,
    [userId]
  );

  return result.rows;
}

export async function getAllCategoryGroups(userId) {
  const result = await pool.query(
    `SELECT id, name, type, color FROM category_groups WHERE user_id = $1 ORDER BY name ASC`,
    [userId]
  );
  return result.rows;
}

export async function createCategory(
  userId,
  { category_group_id, name, icon, excludeFromOverview }
) {
  const result = await pool.query(
    `INSERT INTO categories (category_group_id, name, icon, exclude_from_overview)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [category_group_id, name, icon, excludeFromOverview]
  );
  return result.rows[0];
}

export async function createCategoryGroup(userId, { name, type, color }) {
  const result = await pool.query(
    `INSERT INTO category_groups (user_id, name, type, color)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, type, color`,
    [userId, name, type, color]
  );
  return result.rows[0];
}
