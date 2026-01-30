import { getDb } from "../config/db.js";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";

export async function checkToken(c) {
  const { token } = await c.req.json();
  if (!token) return c.json({ error: "Token required" }, 400);

  const sql = getDb(c);

  try {
    const result = await sql.query(
      "SELECT id, name FROM users WHERE token = $1",
      [token],
    );

    if (result.rows.length === 0) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const user = result.rows[0];
    const isProd = c.env.NODE_ENV === "production";

    const jwtToken = await sign(
      {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90,
      },
      c.env.JWT_SECRET,
    );

    setCookie(c, "authToken", jwtToken, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      secure: isProd,
      sameSite: "Lax",
      domain: isProd ? ".houseofrafa.site" : undefined,
    });

    return c.json({ name: user.name });
  } catch (err) {
    console.error("Auth Error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

export async function getCurrentUser(c) {
  const payload = c.get("jwtPayload");
  if (!payload?.id) return c.json({ error: "Unauthorized" }, 401);

  const sql = getDb(c);

  try {
    const result = await sql.query("SELECT name FROM users WHERE id = $1", [
      payload.id,
    ]);

    if (result.rows.length === 0) {
      return c.json({ error: "User not found" }, 401);
    }

    return c.json({ name: result.rows[0].name });
  } catch (err) {
    console.error("Database Error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
}
