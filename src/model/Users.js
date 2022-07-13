const { model, Schema } = require("mongoose")


const userSchema = new Schema({
    id: { type: String, unique: true },
    username: { type: String, default: null },
    email: { type: String, unique: true },
    hash: { type: String },
    token: { type: String }
})

const User = model('User', userSchema);

export default User