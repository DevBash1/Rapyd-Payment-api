const { model, Schema } = require("mongoose")


const walletSchema = new Schema({
    username: { type: String, default: null },
    email: { type: String, unique: true },
    hash: { type: String },
    token: { type: String }
})

const Wallets = model('Wallets', walletSchema);

export default Wallets