const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AccountModel = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        // required: true
    },
    dob: {
        type: String,
        // required: true
    },
    phone: {
        type: String,
        // unique: true
    },
    sex: {
        type: String
    },
    avatar: {
        type: String
    },
    level: {
        type: String,
        default: "1"
    },
    verifyAccount: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});
module.exports = mongoose.model("Account", AccountModel);