import {
  getTransactionById,
  getTransactionsByWallet,
  getTransactionsByTimeframe,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../repositories/budget-manager/transactions.repository.js";
import { getDb } from "../../config/db.js";

export async function fetchTransactionById(c) {
  const transactionId = Number(c.req.param("id"));
  if (isNaN(transactionId)) {
    return c.json({ error: "Invalid transaction ID" }, 400);
  }

  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const transaction = await getTransactionById(db, transactionId, userId);
    if (!transaction) {
      return c.json({ error: "Transaction not found" }, 404);
    }
    return c.json(transaction);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch transaction" }, 500);
  }
}

export async function fetchTransactionsByWallet(c) {
  const walletId = parseInt(c.req.param("walletId"), 10);

  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const transactions = await getTransactionsByWallet(db, walletId, userId);
    return c.json(transactions);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch transactions" }, 500);
  }
}

export async function fetchTransactionsByTimeframe(c) {
  const { startDate, endDate } = c.req.query();

  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const transactions = await getTransactionsByTimeframe(
      db,
      userId,
      startDate,
      endDate
    );
    return c.json(transactions);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch transactions" }, 500);
  }
}

export async function addTransaction(c) {
  const body = await c.req.json();
  const { amount } = body;

  if (!amount || amount <= 0) {
    return c.json({ error: "Amount must be greater than 0" }, 400);
  }

  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const newTransaction = await createTransaction(db, userId, body);
    return c.json(newTransaction, 201);
  } catch (err) {
    console.error("Error creating transaction:", err);
    return c.json({ error: "Failed to create transaction" }, 500);
  }
}

export async function editTransaction(c) {
  const transactionId = Number(c.req.param("id"));
  const body = await c.req.json();
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    const updated = await updateTransaction(db, userId, transactionId, body);
    return c.json(updated);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
}

export async function removeTransaction(c) {
  const transactionId = Number(c.req.param("id"));
  try {
    const db = getDb(c);
    const userId = c.get("jwtPayload").id;
    await deleteTransaction(db, userId, transactionId);
    return c.body(null, 204);
  } catch (err) {
    console.error("Error deleting transaction:", err);
    if (err.message === "Transaction not found") {
      return c.json({ error: err.message }, 404);
    }
    return c.json({ error: "Failed to delete transaction" }, 500);
  }
}
