const { model, Schema } = require("mongoose")


const transactionsSchema = new Schema({
    username: { type: String, default: null },
    email: { type: String, unique: true },
    hash: { type: String },
    token: { type: String }
})

const Transactions = model('Transactions', transactionsSchema);

export default Transactions