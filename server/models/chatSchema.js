const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    members: {
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "users" }
        ],
        required: true,
        validate: [arrayLimit, '{PATH} must have at least 2 members']
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, ref: "messages"
    },
    unreadMessageCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length >= 2;
}

const chatModel = mongoose.models.chats || mongoose.model("chats", chatSchema);

module.exports = chatModel;