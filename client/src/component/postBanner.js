import React from 'react';
import { Paperclip, Edit2, Trash2 } from 'lucide-react';
import { MessageActions } from './MessageActions';


const MessageBubble = ({ data, onEdit, onDelete }) => (
    <div className={`flex ${data.isSender ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[70%] ${data.isSender ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg px-4 py-2`}>
            <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                    {data.isSender ? 'You' : data.author}
                </span>
                {data.isSender && (
                     <MessageActions
                     messageId={data.id}
                     onEdit={onEdit}
                     onDelete={onDelete}
                   />
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

export default MessageBubble;