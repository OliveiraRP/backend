import express from "express";
import {
  listWallets,
  getWallet,
  addWallet,
  updateWallet,
  archiveWallet,
} from "../../controllers/budget-manager/wallets.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listWallets);
router.post("/", addWallet);
router.get("/:id", getWallet);
router.patch("/:id", updateWallet);
router.patch("/:id/archive", archiveWallet);

export default router;
