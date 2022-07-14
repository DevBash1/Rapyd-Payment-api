const { User, Wallets } = require("../model")
const { genHash, compareHash } = require("../helpers")
const sendResponse = require("../helpers/response")
const { validateEmail, validatePhonenumber } = require("../utils/validate")
const { genAccessToken, genRefreshToken } = require("../helpers/token")
const Fetch = require("../utils/fetch")


class WalletController {

    async createWallet(res, payload) {
        console.log(payload);
        let result = await Fetch("POST","/v1/user",payload);
        let message = result.statusCode == 200 ? "wallet created successfully" : "failed to create wallet";
        let status = result.statusCode == 200 ? true : false;
        sendResponse(res,result.statusCode,status,message,result.body.data);
    }

    async getWallet(res, payload) {

    }
}

module.exports = WalletController