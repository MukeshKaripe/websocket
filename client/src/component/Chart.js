import React, { useEffect, useState } from 'react';

const Chat = ({ socket, room, userName }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // Check socket connection
    useEffect(() => {
        if (!socket) {
            console.error('Socket connection not established');
            return;
        }

        setIsConnected(true);

        // Handle connection events
        socket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('disconnect');
            }
        };
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        
        if (!socket || !isConnected) {
            console.error('Socket connection not available');
            return;
        }

        if (message.trim() !== '') {
            const messageData = {
                roomName: room,
                author: userName,
                message: message,
                time: new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                }),
                isSender: true
            };

            try {
                socket.emit("send_message", messageData);
                setMessages(prev => [...prev, messageData]);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            try {
                setMessages(prev => [...prev, { ...data, isSender: false }]);
            } catch (error) {
                console.error('Error handling received message:', error);
            }
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            if (socket) {
                socket.off("receive_message", handleReceiveMessage);
            }
        };
    }, [socket]);

    const MessageBubble = ({ data }) => (
        <div className={`flex ${data.isSender ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${data.isSender ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg px-4 py-2 flex flex-wrap items-center`}>
                <div className="flex items-center gap-2">
                    <span className={`text-xs opacity-50 ${data.isSender ? 'bg-blue-600 text-white' : 'bg-gray-400'} rounded-full p-2 font-semibold`}>
                        {data.isSender ? 'You' : data.author.charAt(0)}
                    </span>
                </div>
                <p className="text-sm ml-1">{data.message}</p>
                <span className="text-xs opacity-75 block text-right ml-2">
                 <sub>   {data.time}</sub>
                </span>
            </div>
        </div>
    );

    // Show connection status or error message
    if (!socket) {
        return (
            <div className="w-full max-w-2xl p-2 border border-red-200 rounded-lg bg-red-50 text-red-600">
                Socket connection not initialized. Please check your connection.
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg">
            <div className="border-b p-2 bg-white rounded-t-lg">
                <h2 className="text-xl font-semibold">Live Chat - Room: {room}</h2>
                <div className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </div>
            </div>
            
            <div className="h-[400px] overflow-y-auto p-2 bg-gray-50">
                <div className="flex flex-col">
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} data={msg} />
                    ))}
                </div>
            </div>

            <form onSubmit={sendMessage} className="border-t p-2 bg-white rounded-b-lg">
                <div className="flex gap-2">
                    <input
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={!isConnected}
                    />
                    <button
                        type="submit"
                        className={`px-6 py-2 rounded-lg transition-colors ${
                            isConnected 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isConnected}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;