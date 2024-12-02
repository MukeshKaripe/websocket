import * as React from 'react';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton';
import { Menu } from '@mui/base/Menu';
import { MenuItem as BaseMenuItem, MenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { styled } from '@mui/system';

export const MessageActions = ({ onEdit, onDelete, messageId }) => {
    return (
        <><Dropdown>
            <MenuButton> <MoreVertical size={16} /></MenuButton>
            <Menu align="start" className="w-28 bg-white p-2 left-[-32px] shadow-xl rounded">
                <MenuItem onClick={() => onEdit(messageId)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-300 rounded p-2"> <Edit2 size={14} />
                    <span>Edit</span></MenuItem>
                <MenuItem onClick={() => onDelete(messageId)}
                    className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-slate-300 rounded p-2"> <Trash2 size={14} />
                    <span>Delete</span></MenuItem>
            </Menu>
        </Dropdown>
        </>
    );
};