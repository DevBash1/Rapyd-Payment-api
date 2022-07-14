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


module.exports = Router
