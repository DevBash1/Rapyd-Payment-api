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
            return sendResponse(res, 400, false, "Wallet Already Created", {});
        }

        try {
            let result = await Fetch("POST", createPersonalWallet, payload);
            let message =
                result.statusCode == 200
                    ? "wallet created successfully"
                    : "failed to create wallet";
            let status = result.statusCode == 200 ? true : false;
            sendResponse(
                res,
                result.statusCode,
                status,
                message,
                result.body.data
            );

            if (status) {
                // save data
                let walletName =
                    (result.body.data.first_name || "") +
                    " " +
                    (result.body.data.last_name || "");
                const savedData = await Wallets.create({
                    id: genId(),
                    userId: id,
                    wId: result.body.data.id,
                    wName: walletName,
                    wAddr: "",
                    totalBalance: 0,
                    verified: false,
                    status: "unverified",
                    createdAt: Date.now(),
                });
                console.log(savedData);
            }
        } catch (e) {
            sendResponse(res, 500, false, "Something went wrong", {}, {});
        }
    }

    async getWallet(res, payload) {
        const getUser = await Wallets.findOne({ userId: payload });

        if (getUser) {
            payload = getUser.wId;
        }

        try {
            let result = await Fetch("GET", "/v1/user/" + payload);
            let message =
                result.statusCode == 200
                    ? "wallet retrieved successfully"
                    : "failed to retrieve wallet";
            let status = result.statusCode == 200 ? true : false;
            sendResponse(
                res,
                result.statusCode,
                status,
                message,
                result.body.data
            );
        } catch (e) {
            sendResponse(res, 500, false, "failed to retrieve wallet", {}, {});
        }
    }

    async getIdType(res, payload) {
        try {
            let result = await Fetch(
                "GET",
                "/v1/identities/types?country=" + payload
            );
            let message =
                result.statusCode == 200
                    ? "ID Types retrieved successfully"
                    : "failed to retrieve ID Types";
            let status = result.statusCode == 200 ? true : false;
            sendResponse(
                res,
                result.statusCode,
                status,
                message,
                result.body.data
            );
        } catch (e) {
            sendResponse(res, 500, false, "Something went wrong", {}, {});
        }
    }

    async verifyIdentity(res, payload) {}
}

module.exports = WalletController;
