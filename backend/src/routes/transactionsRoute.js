import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

// 1. Specific routes first!
router.get("/summary/:userId", getSummaryByUserId);

// 2. Dynamic/Parameter routes second
router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;