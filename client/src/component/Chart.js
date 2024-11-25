import React, { useEffect, useState } from 'react';
import { Smile, Paperclip, Send, X } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const Chat = ({ socket, room, userName }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (!socket) {
            console.error('Socket connection not established');
            return;
        }

        setIsConnected(true);

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('disconnect');
            }
        };
    }, [socket]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
            setSelectedFile(file);
        } else {
            alert('File size should be less than 5MB');
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
    };

    const handleEmojiSelect = (emoji) => {
        setMessage(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!socket || !isConnected) {
            console.error('Socket connection not available');
            return;
        }

        if (message.trim() === '' && !selectedFile) return;

        try {
            let attachment = null;
            if (selectedFile) {
                // Convert file to base64
                const base64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(selectedFile);
                });
                
                attachment = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    data: base64
                };
            }

            const messageData = {
                roomName: room,
                author: userName,
                message: message.trim(),
                time: new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                }),
                attachment,
                isSender: true
            };

            socket.emit("send_message", messageData);
            setMessages(prev => [...prev, messageData]);
            setMessage('');
            setSelectedFile(null);
        } catch (error) {
            console.error('Error sending message:', error);
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
            <div className={`max-w-[70%] ${data.isSender ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg px-4 py-2`}>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                        {data.isSender ? 'You' : data.author}
                    </span>
                </div>
                {data.message && (
                    <p className="mt-1 text-sm whitespace-pre-wrap">{data.message}</p>
                )}
                {data.attachment && (
                    <div className="mt-2">
                        {data.attachment.type.startsWith('image/') ? (
                            <img 
                                src={data.attachment.data} 
                                alt="attachment" 
                                className="max-w-full rounded-lg"
                            />
                        ) : (
                            <div className="flex items-center gap-2 p-2 bg-white/10 rounded">
                                <Paperclip size={16} />
                                <span className="text-sm truncate">{data.attachment.name}</span>
                            </div>
                        )}
                    </div>
                )}
                <span className="text-xs opacity-75 block text-right mt-1">
                    {data.time}
                </span>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg">
            <div className="border-b p-4 bg-white rounded-t-lg">
                <h2 className="text-xl font-semibold">Live Chat - Room: {room}</h2>
                <div className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </div>
            </div>
            
            <div className="h-[400px] overflow-y-auto p-4 bg-gray-50">
                <div className="flex flex-col">
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} data={msg} />
                    ))}
                </div>
            </div>

            <form onSubmit={sendMessage} className="border-t p-4 bg-white rounded-b-lg">
                {selectedFile && (
                    <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Paperclip size={16} />
                            <span className="text-sm truncate">{selectedFile.name}</span>
                        </div>
                        <button
                            type="button"
                            onClick={removeSelectedFile}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
                <div className="flex gap-2 items-end">
                    <div className="relative flex-1">
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={!isConnected}
                            rows={1}
                            style={{ minHeight: '42px', maxHeight: '120px' }}
                        />
                        {showEmojiPicker && (
                            <div className="absolute bottom-full mb-2">
                                <Picker 
                                    data={data} 
                                    onEmojiSelect={handleEmojiSelect}
                                    theme="light"
                                />
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                    >
                        <Smile size={20} />
                    </button>
                    <label className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                        <input
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        <Paperclip size={20} />
                    </label>
                    <button
                        type="submit"
                        className={`p-2 rounded-lg transition-colors ${
                            isConnected && (message.trim() || selectedFile)
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isConnected || (!message.trim() && !selectedFile)}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;