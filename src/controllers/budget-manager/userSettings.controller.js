import { getUserSettings } from "../../repositories/budget-manager/userSettings.repository.js";
import { getDb } from "../../config/db.js";

export async function fetchUserSettings(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const settings = await getUserSettings(db, userId);
    return c.json(settings);
  } catch (err) {
    return c.json({ error: "Failed to fetch settings" }, 500);
  }
}
