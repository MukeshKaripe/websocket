const express = require('express');
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Load environment variables
require('dotenv').config();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const server = http.createServer(app);

// Add basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const io = new Server(server, {
    cors: {
        // Allow all origins in development, restrict in production
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    maxHttpBufferSize: 1e8, // 100 MB
    pingTimeout: 60000,
    transports: ['websocket', 'polling']
});

// Track connected users and rooms
const connectedUsers = new Map();
const activeRooms = new Set();

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    connectedUsers.set(socket.id, { rooms: new Set() });

    socket.on("join_room", (roomName) => {
        try {
            if (typeof roomName !== 'string' || !roomName.trim()) {
                throw new Error('Invalid room name');
            }

            socket.join(roomName);
            connectedUsers.get(socket.id).rooms.add(roomName);
            activeRooms.add(roomName);

            console.log(`User ${socket.id} joined room: ${roomName}`);
            console.log('Active rooms:', Array.from(activeRooms));

            // Notify room members about new join
            io.to(roomName).emit('user_joined', {
                userId: socket.id,
                roomName: roomName,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    socket.on("send_message", (data) => {
        try {
            if (!data || !data.roomName || !data.message) {
                throw new Error('Invalid message data');
            }

            console.log(`Message in room ${data.roomName} from ${socket.id}:`, data.message);
            socket.to(data.roomName).emit("receive_message", data);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    socket.on("disconnect", () => {
        const userData = connectedUsers.get(socket.id);
        if (userData) {
            // Clean up user's rooms
            userData.rooms.forEach(room => {
                io.to(room).emit('user_left', { userId: socket.id, room });
            });
        }
        connectedUsers.delete(socket.id);
        console.log("User Disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});