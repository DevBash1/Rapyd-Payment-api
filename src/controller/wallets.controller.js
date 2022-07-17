const { User, Wallets, Accounts, Transactions, Products } = require("../model");
const { genHash, compareHash, genId, genUnique } = require("../helpers");
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
    async addFund(res, payload) {
        try {
            let result = await Fetch(
                "POST",
                "/v1/issuing/bankaccounts/bankaccounttransfertobankaccount",
                payload
            );
            let message = result.statusCode == 200 ? "success" : "failed";
            let status = result.statusCode == 200 ? true : false;
            sendResponse(
                res,
                result.statusCode,
                status,
                message,
                result.body.data
            );
        } catch (e) {
            sendResponse(
                res,
                500,
                false,
                `Error: ${e.body.status.message}`,
                e.body
            );
        }
    }

    async createAccount(res, payload, productId) {
        try {
            const walletId = payload.ewallet;
            const getWallet = await Wallets.findOne({ wId: walletId });

            if (!getWallet) {
                return sendResponse(res, 500, false, "wallet id not found", {});
            }

            // Make sure this request came from the right user
            const { id } = res.user;
            const { userId } = getWallet;

            if (id !== userId) {
                return sendResponse(res, 500, false, "Access Denied", {});
            }

            if (!productId) {
                return sendResponse(res, 500, false, "Invalid product id", {});
            }

            // await Products.create({
            //     id: genId(),
            //     name: "Apple",
            //     userId: "980c373d-44bc-4272-bbbc-9efb16cd013b",
            //     createdAt: Date.now(),
            //     price: "25",
            //     description: "A Fresh Green Apple",
            //     image: ""
            // });

            // Get Product Price
            let productPrice = "0";
            try {
                const getProduct = await Products.findOne({
                    id: productId,
                    userId,
                });
                if (!getProduct) {
                    return sendResponse(
                        res,
                        500,
                        false,
                        "Product Not Found",
                        {}
                    );
                }
                productPrice = getProduct.price;
            } catch (e) {
                return sendResponse(res, 500, false, "Product Not Found", {});
            }

            const name = payload.name || "";
            const email = payload.email || "";

            // Delete name and email From Object
            delete payload.name;
            delete payload.email;

            try {
                let result = await Fetch(
                    "POST",
                    "/v1/issuing/bankaccounts",
                    payload
                );
                let message =
                    result.statusCode == 200
                        ? "Vitual Account Created"
                        : "Failed To Create Vitual Account";
                let status = result.statusCode == 200 ? true : false;

                if (status) {
                    // const bankName = result.body.data.bank_account.account_number || "";
                    // const bic = result.body.data.bank_account.account_number || "";
                    // const routingNumber = result.body.data.bank_account.aba_routing_number || "";

                    const iban =
                        result.body.data.bank_account.account_number || "";
                    const county =
                        result.body.data.bank_account.county_iso || "";
                    const currency = result.body.data.currency || "";
                    const accountId = result.body.data.id;
                    const description = result.body.data.description || "";

                    try {
                        const addAccount = await Accounts.create({
                            id: accountId,
                            userId,
                            walletId,
                            iban,
                            county,
                            currency,
                            description,
                            createdAt: Date.now(),
                        });

                        // Create Empty Transaction
                        const createTransaction = await Transactions.create({
                            id: accountId,
                            name,
                            email,
                            paid: "0",
                            totalAmount: productPrice,
                            iban,
                            createdAt: Date.now(),
                            status: "Created",
                        });
                        sendResponse(
                            res,
                            result.statusCode,
                            status,
                            message,
                            result.body.data
                        );
                    } catch (e) {
                        console.log(e);
                        sendResponse(
                            res,
                            500,
                            false,
                            `Error Creating Account`,
                            {},
                            e.body
                        );
                    }
                }
            } catch (e) {
                sendResponse(
                    res,
                    500,
                    false,
                    `Error: ${e.body.status.message}`,
                    {},
                    e.body
                );
            }
        } catch (e) { }
    }

    async getWallet(res, id) {
        const getUser = await Wallets.findOne({ userId: id });

        if (getUser) {
            id = getUser.wId;
        }

        try {
            let result = await Fetch("GET", "/v1/user/" + id);
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
            console.log(e)
            sendResponse(res, 500, false, "failed to retrieve wallet", {});
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
            sendResponse(res, 500, false, "Something went wrong", {});
        }
    }

    async verifyIdentity(res, payload) {
        const { id } = res.user;

        try {
            const getWallet = await Wallets.findOne({ userId: id });
            const walletId = getWallet.wId;

            payload.ewallet = walletId;

            let result = await Fetch("POST", "/v1/identities", payload);
            let message = result.statusCode == 200 ? "success" : "failed";
            let status = result.statusCode == 200 ? true : false;
            sendResponse(
                res,
                result.statusCode,
                status,
                message,
                result.body.data
            );
        } catch (e) {
            sendResponse(
                res,
                500,
                false,
                `Error: ${e.body.status.message}`,
                {},
                e.body
            );
        }
    }

    async webhook(res, payload) {
        console.log(payload);

        // Identity Verification
        if (payload.type === "IDENTITY_VERIFICATION") {
            // Update wallet verification status
            const walletId = payload.data.ewallet;
            const verificationStatus = payload.data.verification_status;

            try {
                if (verificationStatus === "NOT_APPROVED") {
                    const updateWallet = await Wallets.updateOne(
                        { wId: walletId },
                        { verified: false, status: "failed" }
                    );
                } else {
                    const updateWallet = await Wallets.updateOne(
                        { wId: walletId },
                        { verified: true, status: "verified" }
                    );
                }
            } catch (e) {
                console.log(e);
            }
        } else if (payload.type === "ISSUING_DEPOSIT_COMPLETED") {
            // Bank Account Deposit

            const iban = payload.data.bank_account.account_number;
            const getAccount = await Accounts.findOne({ iban });

            // Check if iban exists in Collection
            if (getAccount) {
            }
        }

        sendResponse(res, 200, true, "Webhook Endpoint", {});
    }
}

module.exports = WalletController;
