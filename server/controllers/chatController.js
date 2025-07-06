const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Chat = require("../models/chatSchema");
const Message = require("../models/messageSchema");

router.post("/create-new-chat", authMiddleware, async (req, res) => {
    try {
        const chat = new Chat(req.body);
        const savedChat = await chat.save();

        await savedChat.populate('members');

        res.status(201).send({
            message: "New Chat created successfully",
            success: true,
            data: savedChat
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })

    }
})

router.get('/get-all-chats', authMiddleware, async (req, res) => {
    try {
        const allChats = await Chat.find({ members: { $in: req.user.userId } })
            .populate('members')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.status(200).send({
            message: 'Chat fetched successfully',
            success: true,
            data: allChats
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
});

router.post('/clear-unread-message', authMiddleware, async (req, res) => {
    try {

        const updatedChat = await Chat.findByIdAndUpdate(req.body.chatId, { unreadMessageCount: 0 }, { new: true })
            .populate('members')
            .populate('lastMessage');

        if (!updatedChat) {
            res.send({
                message: "No chat found",
                success: false
            })

        }

        await Message.updateMany({
            chatId: req.body.chatId,
            read: false
        }, { read: true });

        res.status(200).send({
            message: "Unread messages cleared successfully",
            success: true,
            data: updatedChat
        })


    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})


module.exports = router
