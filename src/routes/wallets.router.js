const express = require("express");
const WalletController = require("../controller/wallets.controller");
const isLoggedIn = require("../middlewares/auth")

const Router = express.Router();

const Wallet = new WalletController()

// create

Router.post("/create", isLoggedIn, (req, res) => {
    const payload = req.body;
    Wallet.createWallet(res, payload);
});

// get

Router.post("/get/:id", isLoggedIn, (req, res) => {
    const payload = req.params.id;
    Wallet.getWallet(res, payload);
});

// Id Types

Router.get("/idTypes/:country", (req, res) => {
    const payload = req.params.country;
    Wallet.getIdType(res, payload);
});

// Verify Id

Router.post("/verify", (req, res) => {
    const payload = req.body;
    Wallet.verifyIdentity(res, payload);
});

module.exports = Router
