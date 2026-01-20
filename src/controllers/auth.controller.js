import { pool } from "../config/db.js";
import { env } from "../config/env.js";

export async function checkToken(req, res) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token required" });

  try {
    const result = await pool.query("SELECT name FROM users WHERE token = $1", [
      token,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const name = result.rows[0].name;

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 90,
    });

    res.json({ name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export async function getCurrentUser(req, res) {
  const token = req.cookies.authToken;

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const result = await pool.query("SELECT name FROM users WHERE token = $1", [
      token,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json({ name: result.rows[0].name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
