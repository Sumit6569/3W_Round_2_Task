const express = require("express");
const BankAccount = require("../models/BankAccount");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Middleware for protected routes
router.use(authMiddleware);

// Create bank account
router.post("/", async (req, res) => {
  const account = new BankAccount({ ...req.body, user: req.user.id });
  await account.save();
  res.status(201).json(account);
});

// Get user bank accounts
router.get("/", async (req, res) => {
  const accounts = await BankAccount.find({ user: req.user.id });
  res.json(accounts);
});

// Update bank account
router.put("/:id", async (req, res) => {
  const updated = await BankAccount.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete bank account
router.delete("/:id", async (req, res) => {
  await BankAccount.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Admin: view all
router.get("/admin/all", async (req, res) => {
  const accounts = await BankAccount.find().populate("user"); // Assuming BankAccount is correct model
  res.json(accounts);
});


module.exports = router;
