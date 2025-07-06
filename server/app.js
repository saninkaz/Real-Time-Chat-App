const express = require("express");

const app = express();

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require("./controllers/messageController");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

//Middlewares
app.use(express.json())

// app.use(cors({
//   origin: 'http://localhost:5173',  
//   credentials: true                
// }));

//Server and Socket
const server = new createServer(app);
const io = new Server(server, {
    cors : {
        origin: 'http://localhost:5173',
        methods: ['GET','POST']
    }
})

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

//
io.on('connection', ((socket) => {
    console.log(`Socket connection established successfully, Socket Id: ${socket.id}`)

    socket.on('join-room', (user_id) => {
        socket.join(user_id); 
        console.log("Room joined successfully, room id: ",user_id);
    })

    socket.on("send-message", (message) => {
        io.to(message.members[0]).to(message.members[1])
        .emit('receive-message', message);
    })

    socket.on("clear-unread-messages", (data) => {
        io.to(data.members[0]).to(data.members[1])
        .emit("cleared-message-count",data)
    })

}))

module.exports = server;