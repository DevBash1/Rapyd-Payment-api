const express = require("express");
const WalletController = require("../controller/wallets.controller");
const isLoggedIn = require("../middlewares/auth")

const Router = express.Router();

const Wallet = new WalletController()

// Create Vitual Account

Router.post("/create/:productId", isLoggedIn, (req, res) => {
    const payload = req.body;
    const productId = req.params.productId;
    Wallet.createAccount(res, payload, productId);
});

// Add Fund To Vitual Account

Router.post("/addFund", (req, res) => {
    const payload = req.body;
    Wallet.addFund(res, payload);
});


// get
Router.post("/get/:id", isLoggedIn, (req, res) => {
    const payload = req.params.id;
    Wallet.getWallet(res, payload);
});

// Id Types
Router.get("/identityTypes/:country", (req, res) => {
    const payload = req.params.country;
    Wallet.getIdType(res, payload);
});

// Verify Id
Router.post("/verify", isLoggedIn, (req, res) => {
    const payload = req.body;
    Wallet.verifyIdentity(res, payload);
});

Router.all("/webhook", (req, res) => {
    const payload = req.body;
    Wallet.webhook(res, payload);
});

module.exports = Router
