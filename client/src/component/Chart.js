import React, { useEffect, useState } from 'react';

const Chart = ({ socket, room, userName }) => {
    const [sendMessage, setSendMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    let sendValue = "";

    const sendDataSocket = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (sendMessage.trim() !== '') {
            const messageData = {
                roomName: room,
                author: userName,
                message: sendMessage,
                time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
                //still alot pending
            };
            sendValue = sendMessage;            
            // Emit message to socket
            socket.emit("send_message", messageData);

            // setMessageList((list) => [...list, messageData]);
            setSendMessage('');
        }
    }

    const handleMessageChange = (e) => {
        setSendMessage(e.target.value);
    }

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            // Only add the message if it's not already in the list
            setMessageList((prevList) => 
                // Check if the message already exists to prevent duplicates
                // const messageExists = prevList.some(
                //     (msg) => 
                //         msg.message === data.message && 
                //         msg.time === data.time && 
                //         msg.author === data.author
                // );

                // if (!messageExists) {
                //     return [...prevList, data];
                // }
                // return prevList;
                [...prevList,data]
            );
        };

        socket.on("receive_message", handleReceiveMessage);

        // // Cleanup the event listener
        // return () => {
        //     socket.off("receive_message", handleReceiveMessage);
        // };
    }, [socket]);

    return (
        <div className='w-2/3 border border-black'>
            <div className='chart-header p-4 border-b-2'>
                <h2>Live Chat</h2>
            </div>
            <div className='chart-body p-2 h-64 overflow-y-auto'>
                <div className='flex flex-col space-y-2'>
                    {messageList.map((data, index) => (
                        <div>
                            <div 
                            key={index} 
                            className='text-left bg-gray-100 p-2 rounded-md w-fit'
                        >
                            <div className='font-bold'>{data.message}</div>
                            <span className='text-[10px] text-gray-500'>{data.time}</span>
                        </div>
                            </div>
                    ))}
                    <div>
                        <div className='flex justify-end flex-wrap' >
                        <div 
                            className='text-right bg-gray-100 p-2 rounded-md w-fit'> { sendValue} </div>
                        </div>
                   
                    </div>
                </div>
            </div>
            <form onSubmit={sendDataSocket} className='chart-footer flex'>
                <input 
                    className='p-2 border border-indigo-500 flex-1 outline-none' 
                    type="text" 
                    placeholder='Type a message...' 
                    value={sendMessage}
                    onChange={handleMessageChange}
                ></input>
                <button 
                    type="submit" 
                    className='bg-indigo-300 px-3 py-2'
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chart;