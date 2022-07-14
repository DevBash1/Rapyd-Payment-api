const { User, Wallets } = require("../model")
const { genHash, compareHash } = require("../helpers")
const sendResponse = require("../helpers/response")
const { validateEmail, validatePhonenumber } = require("../utils/validate")
const { genAccessToken, genRefreshToken } = require("../helpers/token")
const Fetch = require("../utils/fetch")


class WalletController {

    async createWallet(res, payload) {

    }

    async getWallet(res, payload) {

    }
}

module.exports = WalletController