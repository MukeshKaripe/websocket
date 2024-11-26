import React, { useEffect, useState } from 'react';
import { Smile, Paperclip, Send, X, Edit2, Trash2, Bell } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./AlertComponets";

const ChatConversation = ({ socket, userName }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [users, setUsers] = useState([
        // Default 10 users
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        // ... add more default users
    ]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Handle message editing
    const startEditing = (messageId) => {
        const messageToEdit = messages.find(m => m.id === messageId);
        if (messageToEdit && messageToEdit.author === userName) {
            setEditingMessageId(messageId);
            setMessage(messageToEdit.message);
        }
    };

    // Handle message deletion
    const initiateDelete = (messageId) => {
        setMessageToDelete(messageId);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (messageToDelete) {
            socket.emit('delete_message', {
                messageId: messageToDelete,
                roomName: 'default',
                author: userName
            });
            setMessages(prev => prev.filter(m => m.id !== messageToDelete));
        }
        setShowDeleteDialog(false);
        setMessageToDelete(null);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!socket || !isConnected) return;
        if (message.trim() === '' && !selectedFile) return;

        try {
            let attachment = null;
            if (selectedFile) {
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
                id: editingMessageId || Date.now().toString(),
                roomName: 'default',
                author: userName,
                message: message.trim(),
                time: new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                }),
                attachment,
                isSender: true,
                isEdited: !!editingMessageId
            };

            if (editingMessageId) {
                socket.emit("edit_message", messageData);
                setMessages(prev => prev.map(m => 
                    m.id === editingMessageId ? messageData : m
                ));
                setEditingMessageId(null);
            } else {
                socket.emit("send_message", messageData);
                setMessages(prev => [...prev, messageData]);
            }

            setMessage('');
            setSelectedFile(null);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Enhanced Message Bubble Component
    const MessageBubble = ({ data, onEdit, onDelete }) => (
        <div className={`flex ${data.isSender ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${data.isSender ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg px-4 py-2`}>
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                        {data.isSender ? 'You' : data.author}
                    </span>
                    {data.isSender && (
                        <div className="flex gap-2 ml-2">
                            <button 
                                onClick={() => onEdit(data.id)}
                                className="opacity-60 hover:opacity-100"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button 
                                onClick={() => onDelete(data.id)}
                                className="opacity-60 hover:opacity-100"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
                {data.message && (
                    <p className="mt-1 text-sm whitespace-pre-wrap">
                        {data.message}
                        {data.isEdited && (
                            <span className="text-xs opacity-75 ml-2">(edited)</span>
                        )}
                    </p>
                )}
                {/* ... rest of the MessageBubble component ... */}
                <span className="text-xs opacity-75 block text-right mt-1">
                    {data.time}
                </span>
            </div>
        </div>
    );

    // Socket event handlers
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            try {
                if (!document.hasFocus()) {
                    setUnreadCount(prev => prev + 1);
                    // Show browser notification
                    if (Notification.permission === "granted") {
                        new Notification("New Message", {
                            body: `${data.author}: ${data.message}`
                        });
                    }
                }
                setMessages(prev => [...prev, { ...data, isSender: false }]);
            } catch (error) {
                console.error('Error handling received message:', error);
            }
        };

        const handleMessageEdit = (data) => {
            setMessages(prev => prev.map(m => 
                m.id === data.id ? { ...data, isSender: m.isSender } : m
            ));
        };

        const handleMessageDelete = (data) => {
            setMessages(prev => prev.filter(m => m.id !== data.messageId));
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_edited", handleMessageEdit);
        socket.on("message_deleted", handleMessageDelete);

        return () => {
            if (socket) {
                socket.off("receive_message", handleReceiveMessage);
                socket.off("message_edited", handleMessageEdit);
                socket.off("message_deleted", handleMessageDelete);
            }
        };
    }, [socket]);

    // Reset unread count when window gains focus
    useEffect(() => {
        const handleFocus = () => setUnreadCount(0);
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    return (
        <div className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg">
            <div className="border-b p-4 bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Live ChatConversation</h2>
                    {unreadCount > 0 && (
                        <div className="flex items-center gap-2">
                            <Bell size={16} className="text-blue-500" />
                            <span className="text-sm font-medium">{unreadCount} new messages</span>
                        </div>
                    )}
                </div>
                <div className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </div>
            </div>
            
            <div className="h-[400px] overflow-y-auto p-4 bg-gray-50">
                <div className="flex flex-col">
                    {messages.map((msg) => (
                        <MessageBubble 
                            key={msg.id} 
                            data={msg}
                            onEdit={startEditing}
                            onDelete={initiateDelete}
                        />
                    ))}
                </div>
            </div>

            {/* Message Input Form */}
            <form onSubmit={sendMessage} className="border-t p-4 bg-white rounded-b-lg">
                {/* ... existing form content ... */}
            </form>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this message? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ChatConversation;