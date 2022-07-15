const { model, Schema } = require("mongoose");

// Virtual Account NUMBER
const virtualAccountsShema = new Schema({
    userId: { type: String },
    walletId: { type: String },
    iban: { type: String },
    country: { type: String },
    currency: { type: String },
    description: { type: String },
    createdAt: { type: String },
});

const Account = model("Account", virtualAccountsShema);

module.exports = Account;
