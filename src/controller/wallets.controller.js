const { User, Wallets } = require("../model")
const { genHash, compareHash } = require("../helpers")
const sendResponse = require("../helpers/response")
const { validateEmail, validatePhonenumber } = require("../utils/validate")
const { genAccessToken, genRefreshToken } = require("../helpers/token")
const Fetch = require("../utils/fetch")
const { createPersonalWallet, createCompanyWallet } = require("../config/rapydEndpoints")

class WalletController {

    async createWallet(res, payload) {
        try {
            let result = await Fetch("POST", "/v1/user", payload);
            let message = result.statusCode == 200 ? "wallet created successfully" : "failed to create wallet";
            let status = result.statusCode == 200 ? true : false;
            sendResponse(res, result.statusCode, status, message, result.body.data);
        } catch (e) {
            sendResponse(res, 500, false, "Something went wrong creating wallet. Try later", e);
        }
    }

    async getWallet(res, payload) {

    }
}

module.exports = WalletController