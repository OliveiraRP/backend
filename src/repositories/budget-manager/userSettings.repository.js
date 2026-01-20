import { pool } from "../../config/db.js";

export async function getUserSettings(userId) {
  const result = await pool.query(
    `SELECT json_preferences FROM user_settings WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0]?.json_preferences || {};
}

export async function updateUserSettings(userId, preferences) {
  const result = await pool.query(
    `INSERT INTO user_settings (user_id, json_preferences)
     VALUES ($1, $2)
     ON CONFLICT (user_id) 
     DO UPDATE SET json_preferences = user_settings.json_preferences || $2
     RETURNING json_preferences`,
    [userId, JSON.stringify(preferences)]
  );
  return result.rows[0].json_preferences;
}
