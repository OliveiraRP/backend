import { Hono } from "hono";
import {
  fetchTransactionById,
  fetchTransactionsByWallet,
  fetchTransactionsByTimeframe,
  addTransaction,
  editTransaction,
  removeTransaction,
} from "../../controllers/budget-manager/transactions.controller.js";

const router = new Hono();

router.get("/", fetchTransactionsByTimeframe);
router.post("/", addTransaction);
router.get("/:id", fetchTransactionById);
router.put("/:id", editTransaction);
router.delete("/:id", removeTransaction);
router.get("/wallet/:walletId", fetchTransactionsByWallet);

export default router;
