import { Wallet } from "../../models/budget-manager/wallet.model.js";

export async function getWalletsByUser(sql, userId) {
  const result = await sql.query(
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

export async function getWalletById(sql, walletId, userId) {
  const result = await sql.query(
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

export async function createWallet(sql, userId, walletData) {
  const { name, type, balance, includeInNetWorth, color, icon } = walletData;

  const result = await sql.query(
    `INSERT INTO wallets (user_id, name, type, initial_balance, balance, include_net_worth, color, icon)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, name, type, balance, balance, includeInNetWorth, color, icon]
  );

  return new Wallet(result.rows[0]);
}

export async function archiveWalletById(sql, walletId, userId) {
  const result = await sql.query(
    `UPDATE wallets 
     SET archived = true 
     WHERE id = $1 AND user_id = $2 
     RETURNING *`,
    [walletId, userId]
  );
  return result.rows.length > 0;
}

export async function updateWalletById(sql, walletId, userId, walletData) {
  const {
    name,
    initialBalance,
    includeNetWorth,
    color,
    icon,
    goal,
    annualBudget,
  } = walletData;

  return await sql.transaction(async (tx) => {
    const currentWallet = await tx.query(
      `SELECT initial_balance FROM wallets WHERE id = $1 AND user_id = $2`,
      [walletId, userId]
    );

    if (currentWallet.rows.length === 0) return null;

    const oldInitial = Number(currentWallet.rows[0].initial_balance);
    const newInitial = Number(initialBalance);
    const hasInitialChanged = Math.abs(newInitial - oldInitial) > 0.001;

    if (hasInitialChanged) {
      await tx.query(
        `UPDATE wallets 
         SET name = $1, icon = $2, color = $3, include_net_worth = $4,
             balance = balance + ($5 - initial_balance), 
             initial_balance = $5
         WHERE id = $6 AND user_id = $7`,
        [name, icon, color, includeNetWorth, newInitial, walletId, userId]
      );
    } else {
      await tx.query(
        `UPDATE wallets 
         SET name = $1, icon = $2, color = $3, include_net_worth = $4
         WHERE id = $5 AND user_id = $6`,
        [name, icon, color, includeNetWorth, walletId, userId]
      );
    }

    if (goal !== undefined && goal !== null) {
      await tx.query(`UPDATE wallet_goal SET goal = $1 WHERE wallet_id = $2`, [
        goal,
        walletId,
      ]);
    }

    if (annualBudget !== undefined && annualBudget !== null) {
      await tx.query(
        `UPDATE wallet_budget SET annual_budget = $1 WHERE wallet_id = $2`,
        [annualBudget, walletId]
      );
    }

    const finalResult = await tx.query(
      `SELECT w.*, wg.goal, wb.annual_budget
       FROM wallets w
       LEFT JOIN wallet_goal wg ON w.id = wg.wallet_id
       LEFT JOIN wallet_budget wb ON w.id = wb.wallet_id
       WHERE w.id = $1 AND w.user_id = $2`,
      [walletId, userId]
    );

    return finalResult.rows.length > 0 ? new Wallet(finalResult.rows[0]) : null;
  });
}
