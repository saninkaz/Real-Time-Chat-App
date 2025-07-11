const mongoose = require('mongoose');

const messageScema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId, ref: "chats"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId, ref: "users"
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const messageModel = mongoose.models.messages || mongoose.model('messages', messageScema);

module.exports = messageModel;