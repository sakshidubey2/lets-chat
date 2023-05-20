import React, { useState, useEffect } from 'react';
import '../css/sideBox.css';
import Avatar from '@mui/material/Avatar';
import ChatRoom from './chatRoom';
import AddNewChat from './addNewChat';
import { db, query, orderBy, collection, onSnapshot } from '../../firebase';
import { useStateValue } from './stateProvider';

function SideBox() {
    const [rooms, setRooms] = useState([]);
    const [{ user }] = useStateValue();
    const capitalize = (str) => str && str[0].toUpperCase() + str.slice(1).toLowerCase();

    useEffect(() => {
        const roomInAscOrder = query(collection(db, 'chatRooms'), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(roomInAscOrder, (snapshots) => (
            setRooms(snapshots.docs.map((doc) => (
                {
                    id: doc.id,
                    data: doc.data(),
                }
            )))
        ));

        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <div className="sideBox">
            <header className="sideBox_header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${user.displayName}${user.uid}.svg`} variant="rounded" />
                <div className="chatRoomInfo">
                    <h1>{capitalize(user.displayName)}</h1>
                </div>
            </header>
            <AddNewChat />
            <div className="sideBox_chatRoom">
                <div className="chatRoomBox">
                    {rooms.map((room) => (
                        <ChatRoom key={room.id} id={room.id} name={room.data.name} uid={room.data.uid} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SideBox;