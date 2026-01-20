import { pool } from "../config/db.js";

export async function authMiddleware(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const result = await pool.query("SELECT id FROM users WHERE token = $1", [
      token,
    ]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid token" });

    req.userId = result.rows[0].id;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
