const { model, Schema } = require("mongoose")


const transactionSchema = new Schema({
    id: { type: String },
    wAddr: { type: String },
    amount: { type: String },
    name: { type: String },
    email: { type: String },
    iban: { type: String },
    status: { type: String },
    createdAt: { type: String },
}, { versionKey: false })

const Transactions = model('Transactions', transactionSchema);

export default Transactions