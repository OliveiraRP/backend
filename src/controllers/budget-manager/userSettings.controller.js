import { getUserSettings } from "../../repositories/budget-manager/userSettings.repository.js";

export async function fetchUserSettings(req, res) {
  try {
    const settings = await getUserSettings(req.userId);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
}
