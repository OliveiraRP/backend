import {
  getWalletsByUser,
  getWalletById,
  createWallet,
  archiveWalletById,
  updateWalletById,
} from "../../repositories/budget-manager/wallets.repository.js";

export async function listWallets(req, res) {
  try {
    const wallets = await getWalletsByUser(req.userId);
    res.json(wallets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export async function getWallet(req, res) {
  try {
    const wallet = await getWalletById(req.params.id, req.userId);
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json(wallet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export async function addWallet(req, res) {
  try {
    const newWallet = await createWallet(req.userId, req.body);
    res.status(201).json(newWallet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create wallet" });
  }
}

export async function archiveWallet(req, res) {
  try {
    const success = await archiveWalletById(req.params.id, req.userId);
    if (!success) return res.status(404).json({ error: "Wallet not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export async function updateWallet(req, res) {
  try {
    const updatedWallet = await updateWalletById(
      req.params.id,
      req.userId,
      req.body
    );

    if (!updatedWallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.json(updatedWallet);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not update wallet" });
  }
}
