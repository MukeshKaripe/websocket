import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatConversation from './component/Conversation';
import { Card, CardHeader, CardContent, Button } from '@mui/material';
import AnimatedText from './component/AnimatedText';

let socket;

const App = () => {
  const [userName, setUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [connectionError, setConnectionError] = useState("");
  const [defaultUsers, setDefaultUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [step, setStep] = useState('username');

  useEffect(() => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

    socket = io(BACKEND_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
      setConnectionError("");
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError("Failed to connect to chat server");
    });

    socket.on('default_users', (users) => {
      console.log('Received users:', users);
      setDefaultUsers(users);
    });

    socket.on('registration_success', (user) => {
      console.log('Registration successful:', user);
      setCurrentUser(user);
      setStep('select-user');
    });

    socket.on('error', (error) => {
      setConnectionError(error.message);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();

    if (!socket?.connected) {
      setConnectionError("Not connected to server");
      return;
    }

    if (userName.trim() === "") {
      setConnectionError("Username is required");
      return;
    }

    // Register user with server
    socket.emit("register_user", userName.trim());
  };

  const handleUserSelect = (user) => {
    if (user.name === currentUser.name) {
      setConnectionError("Cannot chat with yourself");
      return;
    }

    setSelectedUser(user);
    const roomName = `private_${[currentUser.name, user.name].sort().join('_')}`;

    try {
      socket.emit("join_room", {
        userName: currentUser.name,
        room: roomName
      });
      setStep('chat');
    } catch (error) {
      console.error('Error joining chat:', error);
      setConnectionError("Failed to start chat");
    }
  };

  const renderUsernameStep = () => (
    <form onSubmit={handleUsernameSubmit}  className="App flex justify-center items-center w-full flex-col h-dvh">
      <div className='flex flex-col gap-2 shadow-2xl  max-w-[500px] p-4 '>
        <div className="room-socket flex justify-center flex-col items-center gap-2 w-[300px]">
          <AnimatedText />
        </div>
        <h2 className="text-2xl text-center font-semibold mb-4">
          Let's Chat
        </h2>
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border border-indigo-500 w-full rounded"
          />
        </div>
        <button
          className="bg-indigo-500 text-white px-3 py-2 w-full rounded hover:bg-indigo-600 transition-colors">
          Continue...
        </button>
      </div>
    </form>
  );

  const renderUserSelection = () => (
    <Card className="w-full max-w-md mx-auto mt-8">
      <div className="text-2xl font-semibold text-center p-4">
        Select a User to Chat With
      </div>
      <CardContent>
        <div className="space-y-2 flex flex-wrap items-center">
          {defaultUsers
            .filter(user => user.name !== currentUser?.name)
            .map((user) => (
              <Button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="w-1/2 text-left justify-start p-4 hover:bg-gray-100 bg-gray-800"
              >
                {user.name}
                {user.isDefaultUser && " (Default User)"}
              </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderChat = () => (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <Card>
        <div className="text-xl font-bold p-4">
          Chat with {selectedUser?.name}
        </div>
        <CardContent>
          <ChatConversation
            socket={socket}
            userName={currentUser.name}
            room={`private_${[currentUser.name, selectedUser.name].sort().join('_')}`}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {connectionError && (
        <div className="text-red-500 text-center mb-4">
          {connectionError}
        </div>
      )}

      {step === 'username' && renderUsernameStep()}
      {step === 'select-user' && renderUserSelection()}
      {step === 'chat' && renderChat()}
    </div>
  );
};

export default App;