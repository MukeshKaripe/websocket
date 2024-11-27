const express = require('express');
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

require('dotenv').config();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const server = http.createServer(app);

// Initialize with default users and their chat histories
const defaultUsers = [
    { id: 'user1', name: 'John Doe' },
    { id: 'user2', name: 'Jane Smith' },
    { id: 'user3', name: 'siri' },

    // ... other users
];

// Store active users, their sockets, and messages
const connectedUsers = new Map(); // socket.id -> { userName, currentRoom }
const userSockets = new Map();    // userName -> socket.id
const messageHistory = new Map();  // roomName -> messages[]

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    maxHttpBufferSize: 1e8,
    pingTimeout: 60000,
    transports: ['websocket', 'polling']
});

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Send default users list on connection
    socket.emit('default_users', defaultUsers);

    // Handle user registration/login
    socket.on("register_user", (userName) => {
        try {
            // Check if username exists in default users
            const existingDefaultUser = defaultUsers.find(u => u.name === userName);
            
            if (existingDefaultUser) {
                // If user exists in default users, associate socket
                userSockets.set(userName, socket.id);
                socket.emit('registration_success', { 
                    ...existingDefaultUser,
                    isDefaultUser: true 
                });
            } else {
                // Create new user
                const newUser = {
                    id: `user_${Date.now()}`,
                    name: userName,
                    isDefaultUser: false
                };
                defaultUsers.push(newUser);
                userSockets.set(userName, socket.id);
                socket.emit('registration_success', newUser);
            }

            // Broadcast updated users list
            io.emit('default_users', defaultUsers);
        } catch (error) {
            console.error('Registration error:', error);
            socket.emit('error', { message: 'Failed to register user' });
        }
    });

    // Join room handler
    socket.on("join_room", (data) => {
        try {
            const { userName, room } = data;
            
            // Leave current room if any
            const currentUser = connectedUsers.get(socket.id);
            if (currentUser && currentUser.currentRoom) {
                socket.leave(currentUser.currentRoom);
            }

            // Join new room
            socket.join(room);
            connectedUsers.set(socket.id, { userName, currentRoom: room });

            // Get existing messages for this room
            const roomMessages = messageHistory.get(room) || [];
            socket.emit('message_history', roomMessages);

            // Notify room members
            io.to(room).emit('user_joined', {
                userId: socket.id,
                userName,
                room
            });
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    // Send message handler
    socket.on("send_message", (data) => {
        try {
            const messageId = Date.now().toString();
            const messageData = {
                ...data,
                id: messageId,
                timestamp: new Date().toISOString()
            };

            // Store in history
            if (!messageHistory.has(data.roomName)) {
                messageHistory.set(data.roomName, []);
            }
            messageHistory.get(data.roomName).push(messageData);

            // Broadcast to room
            socket.to(data.roomName).emit("receive_message", messageData);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // ... (keep existing edit_message and delete_message handlers)

    socket.on("disconnect", () => {
        const userData = connectedUsers.get(socket.id);
        if (userData) {
            userSockets.delete(userData.userName);
            connectedUsers.delete(socket.id);
            io.to(userData.currentRoom).emit('user_left', {
                userId: socket.id,
                userName: userData.userName
            });
        }
        console.log("User Disconnected:", socket.id);
    });
});

server.listen(process.env.PORT || 3001);