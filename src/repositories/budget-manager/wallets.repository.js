import { pool } from "../../config/db.js";
import { Wallet } from "../../models/budget-manager/wallet.model.js";

export async function getWalletsByUser(userId) {
  const result = await pool.query(
    `SELECT 
        w.*, 
        wg.goal,
        wb.annual_budget
     FROM wallets w
     LEFT JOIN wallet_goal wg ON w.id = wg.wallet_id
     LEFT JOIN wallet_budget wb ON w.id = wb.wallet_id
     WHERE w.user_id = $1 AND w.archived = false
     ORDER BY w.id`,
    [userId]
  );

  return result.rows.map((row) => new Wallet(row));
}

export async function getWalletById(walletId, userId) {
  const result = await pool.query(
    `SELECT 
        w.*, 
        wg.goal,
        wb.annual_budget
     FROM wallets w
     LEFT JOIN wallet_goal wg ON w.id = wg.wallet_id
     LEFT JOIN wallet_budget wb ON w.id = wb.wallet_id
     WHERE w.id = $1 AND w.user_id = $2`,
    [walletId, userId]
  );

  if (result.rows.length === 0) return null;
  return new Wallet(result.rows[0]);
}

export async function createWallet(userId, walletData) {
  const { name, type, balance, includeInNetWorth, color, icon } = walletData;

  const result = await pool.query(
    `INSERT INTO wallets (user_id, name, type, initial_balance, balance, include_net_worth, color, icon)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, name, type, balance, balance, includeInNetWorth, color, icon]
  );

  return new Wallet(result.rows[0]);
}

export async function archiveWalletById(walletId, userId) {
  const result = await pool.query(
    `UPDATE wallets 
     SET archived = true 
     WHERE id = $1 AND user_id = $2 
     RETURNING *`,
    [walletId, userId]
  );
  return result.rowCount > 0;
}

export async function updateWalletById(walletId, userId, walletData) {
  const { name, includeNetWorth, color, icon, goal, annualBudget } = walletData;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const walletResult = await client.query(
      `UPDATE wallets 
       SET name = $1, icon = $2, color = $3, include_net_worth = $4
       WHERE id = $5 AND user_id = $6 
       RETURNING *`,
      [name, icon, color, includeNetWorth, walletId, userId]
    );

    if (walletResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    if (goal !== undefined && goal !== null) {
      await client.query(
        `UPDATE wallet_goal SET goal = $1 WHERE wallet_id = $2`,
        [goal, walletId]
      );
    }

    if (annualBudget !== undefined && annualBudget !== null) {
      await client.query(
        `UPDATE wallet_budget SET annual_budget = $1 WHERE wallet_id = $2`,
        [annualBudget, walletId]
      );
    }

    await client.query("COMMIT");

    return await getWalletById(walletId, userId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
