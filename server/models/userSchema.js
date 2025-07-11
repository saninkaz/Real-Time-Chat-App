const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profilePic: {
        type: String,
        required: false
    }
}, { timestamps: true })

const userModel = mongoose.models.users || mongoose.model("users", userSchema)

module.exports = userModel