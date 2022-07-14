const { User, Wallets } = require("../model");
const { genHash, compareHash, genId } = require("../helpers");
const sendResponse = require("../helpers/response");
const { validateEmail, validatePhonenumber } = require("../utils/validate");
const {
    genAccessToken,
    genRefreshToken,
    verifyToken,
} = require("../helpers/token");
const Fetch = require("../utils/fetch");
const {
    createPersonalWallet,
    createCompanyWallet,
} = require("../config/rapydEndpoints");

class WalletController {
    async createWallet(res, payload) {
        let { id } = res.user;
        const walletExist = await Wallets.find({ userId: id });

        if (walletExist.length != 0) {
            return sendResponse(res, 400, false, "Wallet Already Exists", {});
        }

        let result = await Fetch("POST", "/v1/user", payload);
        let message =
            result.statusCode == 200
                ? "wallet created successfully"
                : "failed to create wallet";
        let status = result.statusCode == 200 ? true : false;
        sendResponse(res, result.statusCode, status, message, result.body.data);

        if (status) {
            // save data
            const savedData = await Wallets.create({
                id: genId(),
                userId: id,
                wId: result.body.data.id,
                wName: (result.body.data.first_name||"") + " " + (result.body.data.last_name||""),
                wAddr: "",
                totalBalance: 0,
                verified: true,
                status: "unverified",
                createdAt: Date.now(),
            });
            console.log(savedData);
        }
    }

    async getWallet(res, payload) {
        let result = await Fetch("GET", "/v1/user/" + payload);
        let message =
            result.statusCode == 200
                ? "wallet retrieved successfully"
                : "failed to retrieve wallet";
        let status = result.statusCode == 200 ? true : false;
        sendResponse(res, result.statusCode, status, message, result.body.data);
    }
}

module.exports = WalletController;