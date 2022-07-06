import express from "express";
import WalletController from "../controller/wallets.controller";
import isLoggedIn from "../middlewares/auth"

const Router = express.Router();

const Wallet = new WalletController()

// create

Router.post("/create", isLoggedIn, (req, res) => {
    const payload = req.body;
    Wallet.createWallet(res, payload);
});


export default Router;
