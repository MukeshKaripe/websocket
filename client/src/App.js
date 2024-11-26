import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chart from './component/Chart';
import AnimatedText from './component/AnimatedText';
import ChatConversation from './component/Conversation';

// Initialize socket outside component to prevent multiple connections
let socket;

function App() {
  const [userName, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  useEffect(() => {
    // Initialize socket connection
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    console.log('Connecting to:', BACKEND_URL); // Debug log

    socket = io(BACKEND_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
      setConnectionError("");
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError("Failed to connect to chat server");
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const joinRoom = () => {
    if (!socket?.connected) {
      setConnectionError("Not connected to server");
      return;
    }

    if (userName.trim() === "" || room.trim() === "") {
      setConnectionError("Username and room name are required");
      return;
    }

    try {
      socket.emit("join_room", room);
      console.log('Joining room:', room); // Debug log
      setShowChat(true);
      setConnectionError("");
    } catch (error) {
      console.error('Error joining room:', error);
      setConnectionError("Failed to join room");
    }
  };

  return (
    <div className="App flex justify-center items-center w-full h-dvh">
      {!showChat ? (
        <div className="room-socket flex justify-center flex-col items-center gap-2 w-[300px]">
          <AnimatedText/>
          <h2 className="text-2xl font-bold mb-4">
            Let's Chat
          </h2>
          {connectionError && (
            <div className="text-red-500 text-sm mb-2">{connectionError}</div>
          )}
          <input
            className="p-2 border border-indigo-500 w-full rounded"
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="p-2 border border-indigo-500 w-full rounded"
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            className="bg-indigo-500 text-white px-3 py-2 w-full rounded hover:bg-indigo-600 transition-colors"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      ) : (
        // <Chart socket={socket} userName={userName} room={room} />
        <ChatConversation socket={socket} userName={userName} room={room} /> 
      )}
    </div>
  );
}

export default App;