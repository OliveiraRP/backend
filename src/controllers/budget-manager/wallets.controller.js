import {
  getWalletsByUser,
  getWalletById,
  createWallet,
  archiveWalletById,
  updateWalletById,
} from "../../repositories/budget-manager/wallets.repository.js";
import { getDb } from "../../config/db.js";

export async function listWallets(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const wallets = await getWalletsByUser(db, userId);
    return c.json(wallets);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Database error" }, 500);
  }
}

export async function getWallet(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const walletId = c.req.param("id");
    const wallet = await getWalletById(db, walletId, userId);
    if (!wallet) return c.json({ error: "Wallet not found" }, 404);
    return c.json(wallet);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Database error" }, 500);
  }
}

export async function addWallet(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const body = await c.req.json();
    const newWallet = await createWallet(db, userId, body);
    return c.json(newWallet, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Could not create wallet" }, 500);
  }
}

export async function archiveWallet(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const walletId = c.req.param("id");
    const success = await archiveWalletById(db, walletId, userId);
    if (!success) return c.json({ error: "Wallet not found" }, 404);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Database error" }, 500);
  }
}

export async function updateWallet(c) {
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const walletId = c.req.param("id");
    const body = await c.req.json();
    const updatedWallet = await updateWalletById(db, walletId, userId, body);

    if (!updatedWallet) {
      return c.json({ error: "Wallet not found" }, 404);
    }

    return c.json(updatedWallet);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Could not update wallet" }, 500);
  }
}
