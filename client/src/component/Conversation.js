import React, { useEffect, useState, useRef } from 'react';
import { Smile, Paperclip, Send, X, Bell } from 'lucide-react';
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
import MessageBubble from '../component/postBanner';
import NotificationManager from './NotificationManagement';

const ChatConversation = ({ socket, userName, room }) => {
    const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
    const [windowFocused, setWindowFocused] = useState(true);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Request notification permission when component mounts
        const setupNotifications = async () => {
            const hasPermission = await NotificationManager.requestPermission();
            setHasNotificationPermission(hasPermission);
        };

        setupNotifications();

        // Window focus handlers
        const handleFocus = () => setWindowFocused(true);
        const handleBlur = () => setWindowFocused(false);

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        const textArea = textareaRef.current;
        if (!textArea) return;
        textArea.style.height = '44px';
        const scrollHeight = textArea.scrollHeight;
        textArea.style.height = Math.min(scrollHeight, 100) + "px";
        scrollToBottom();
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };


    }, [messages, message]);

    useEffect(() => {
        if (!socket) return;

        setIsConnected(socket.connected);

        const onConnect = () => {
            setIsConnected(true);
            console.log('Socket connected');
            socket.emit('join_room', { roomName: room, userName });
        };

        const onDisconnect = () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        };

        const onReceiveMessage = async (data) => {
            setMessages(prev => [...prev, { ...data, isSender: data.author === userName }]);
            if (!document.hasFocus()) {
                setUnreadCount(prev => prev + 1);
            }
            if (!windowFocused && hasNotificationPermission) {
                await NotificationManager.showNotification(
                    `New message from ${data.author}`,
                    {
                        body: data.message,
                        tag: `chat-${room}`, // Prevents duplicate notifications
                        renotify: true,      // Shows new notification even with same tag
                    }
                );
            }
        };
        console.log(Notification.permission);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('receive_message', onReceiveMessage);
        socket.on('message_edited', handleMessageEdit);
        socket.on('message_deleted', handleMessageDelete);

        if (socket && !socket.connected) {
            socket.connect();
        }

        return () => {
            if (socket) {
                socket.off('connect', onConnect);
                socket.off('disconnect', onDisconnect);
                socket.off('receive_message', onReceiveMessage);
                socket.off('message_edited', handleMessageEdit);
                socket.off('message_deleted', handleMessageDelete);
            }
        };
    }, [socket, userName, room, windowFocused, hasNotificationPermission]);

    const handleMessageEdit = (data) => {
        setMessages(prev => prev.map(m =>
            m.id === data.id ? { ...data, isSender: m.isSender } : m
        ));
    };

    const handleMessageDelete = (data) => {
        setMessages(prev => prev.filter(m => m.id !== data.messageId));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
            setSelectedFile(file);
        } else {
            alert('File size should be less than 5MB');
        }
    };

    const handleEmojiSelect = (emoji) => {
        setMessage(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    const startEditing = (messageId) => {
        const messageToEdit = messages.find(m => m.id === messageId);
        if (messageToEdit && messageToEdit.author === userName) {
            setEditingMessageId(messageId);
            setMessage(messageToEdit.message);
        }
    };

    const initiateDelete = (messageId) => {
        setMessageToDelete(messageId);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (messageToDelete) {
            socket.emit('delete_message', {
                messageId: messageToDelete,
                roomName: room,
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
                roomName: room,
                author: userName,
                message: message.trim(),
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                attachment,
                isEdited: !!editingMessageId
            };

            if (editingMessageId) {
                socket.emit("edit_message", messageData);
                setMessages(prev => prev.map(m =>
                    m.id === editingMessageId ? { ...messageData, isSender: true } : m
                ));
                setEditingMessageId(null);
            } else {
                socket.emit("send_message", messageData);
                setMessages(prev => [...prev, { ...messageData, isSender: true }]);
            }

            setMessage('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg">
            <div className="border-b p-4 bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Live Chat</h2>
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
            <div className="relative">
                <div className="h-[400px] overflow-y-auto  p-4 bg-gray-50">
                    <div className=" flex flex-col">
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
                <div className='absolute bottom-0 right-5' ref={messagesEndRef} > <span>Down</span> </div>
            </div>


            <form onSubmit={sendMessage} className="border-t p-4 bg-white rounded-b-lg">
                <div className="flex items-center gap-2">
                    <div className="flex items-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <Smile size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <Paperclip size={20} />
                        </button>
                    </div>
                    <div className="flex-1 flex item-center">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {selectedFile && (
                            <div className="mt-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Paperclip size={16} />
                                    <span className="text-sm truncate">{selectedFile.name}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFile(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                />
                {showEmojiPicker && (
                    <div className="absolute bottom-20 right-4">
                        <Picker
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                            theme="light"
                        />
                    </div>
                )}
            </form>

            <AlertDialog open={showDeleteDialog}  onOpenChange={setShowDeleteDialog}>
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