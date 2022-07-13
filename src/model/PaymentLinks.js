const { model, Schema } = require("mongoose")


const paymentLinksSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: Boolean },
    wAddr: { type: String },
    wId: { type: String },
    active: { type: Boolean },
    createdAt: { type: String }
})


const PaymentLinks = model('PaymentLinks', paymentLinksSchema);

export default PaymentLinks