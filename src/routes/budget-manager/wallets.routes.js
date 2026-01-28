import { Hono } from "hono";
import {
  listWallets,
  getWallet,
  addWallet,
  updateWallet,
  archiveWallet,
} from "../../controllers/budget-manager/wallets.controller.js";

const router = new Hono();

router.get("/", listWallets);
router.post("/", addWallet);
router.get("/:id", getWallet);
router.patch("/:id", updateWallet);
router.patch("/:id/archive", archiveWallet);

export default router;
