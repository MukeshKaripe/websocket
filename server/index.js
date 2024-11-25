const express = require('express');
const app = express();
const http = require("http")
const cors = require("cors"); //to resolve lot of socket io issues
const { Server } = require("socket.io");
app.use(cors());
app.use(express.json({ limit: '10mb' }));


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTED_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1E8
})

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined the room: ${data}`);
    });
    socket.on("send_message", (data) => {
        // console.log(data,'dhhd');
        socket.to(data.roomName).emit("receive_message", data)
    });
    socket.on("disconnect", () => {
        console.log("User Discconnected:", socket.id);
    })

})
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log("server RUNNING");
})
