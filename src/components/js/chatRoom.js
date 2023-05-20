import React from 'react';
import '../css/chatRoom.css';
import Avatar from '@mui/material/Avatar';
import { Link, useParams } from "react-router-dom";

function ChatRoom({ id, name }) {
    const { roomId } = useParams();
    const color = roomId === id ? '#d8deec' : 'transparent';
    return (
        <Link to={`/rooms/${id}`} style={{ textDecoration: 'none' }}>
            <div className="chatRoom" style={{ backgroundColor: color }}>
                <Avatar src={`https://avatars.dicebear.com/api/human/${id}.svg`} variant="rounded" />
                <div className="chatRoomInfo">
                    <h2>{name}</h2>
                </div>
            </div>
        </Link>
    );
}

export default ChatRoom;