const router = require("express").Router();
const Message = require("../models/messageSchema");
const Chat = require("../models/chatSchema");
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/new-message", authMiddleware, async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        // const currentChat = await Chat.findById(req.body.chatId)
        // currentChat.lastMessage = savedMessage._id;
        // currentChat.unreadMessageCount=currentChat.unreadMessageCount+1;
        // await currentChat.save();

        const currentChat = await Chat.findByIdAndUpdate(req.body.chatId, {
            lastMessage: savedMessage._id,
            $inc: { unreadMessageCount: 1 }
        });

        res.status(201).send({
            message: "Message sent successfully",
            success: true,
            data: savedMessage
        })

    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.get("/get-all-messages/:chatId", authMiddleware, async (req, res) => {
    try {
        const allMessages = await Message.find({chatId : {$eq : req.params.chatId}})
                                         .sort({createdAt: 1});

        res.status(201).send({
            message: "Messages fetched successfully",
            success: true,
            data: allMessages
        })

    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

module.exports = router