import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useStateValue } from './stateProvider';

const PrivateChatBox = () => {
  const divRef = useRef(null);
  const { roomId } = useParams();
  const history = useHistory();
  const [{ user }] = useStateValue();
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const capitalize = (str) => str && str[0].toUpperCase() + str.slice(1).toLowerCase();
  const [newMessage, setNewMessage] = useState('');

  const sendMsg = (e) => {
    e.preventDefault();
    addDoc(collection(collection(db, 'privateChatRooms', roomId, 'messages')), {
      senderId: user.uid,
      message: e.target.sendText.value,
      timestamp: serverTimestamp(),
    });
    setNewMessage('');
  };

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (roomId) {
      const unsubscribeRoom = onSnapshot(doc(collection(db, 'privateChatRooms'), roomId), (snapshot) => {
        setRoom(snapshot.data());
      }, (error) => {
        console.error('Error fetching room:', error);
      });

      const msgInAscOrder = query(collection(collection(db, 'privateChatRooms', roomId, 'messages')), orderBy('timestamp', 'asc'));
      const unsubscribeMsg = onSnapshot(msgInAscOrder, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      }, (error) => {
        console.error('Error fetching messages:', error);
      });

      return () => {
        unsubscribeRoom();
        unsubscribeMsg();
      };
    }
  }, [roomId]);

  return (
    <>
      {roomId ? (
        <div className="chatBox">
          <header className="chatBox_header">
            <Avatar src={`https://avatars.dicebear.com/api/human/${roomId}.svg`} variant="rounded" />
            <div className="chatRoomInfo">
              <h2>{room.name}</h2>
            </div>
            <div className="backLink">
              <IconButton sx={{ p: '10px' }} aria-label="back" onClick={() => history.push('/')} >
                <ArrowBackIcon />
              </IconButton>
            </div>
          </header>
          <div className="chatBox_body">
            <div className="msgDisplayBox">
              {messages.map((each, index) => (
                <div key={index} className={`msgBox ${each.senderId === user.uid && 'msgReciver'}`}>
                  <span className="msgName">{capitalize(each.senderId)}</span>
                  <p className="msg">{each.message}</p>
                  <div className="msgInfo">
                    <span>{new Date(each.timestamp?.toDate()).toDateString()},&nbsp;</span>
                    <span>{new Date(each.timestamp?.toDate()).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              <div ref={divRef} />
            </div>
          </div>
          <footer className="chatBox_footer">
            <Paper
              component="form"
              sx={{ display: 'flex', flex: 1, alignItems: 'center', boxShadow: 'none' }}
              onSubmit={sendMsg}
            >
              <InputBase
                sx={{ px: 1, flex: 1 }}
                placeholder="Write a message"
                inputProps={{ 'aria-label': 'write a message' }}
                name="sendText"
                id="textField"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="send">
                <ArrowUpwardIcon />
              </IconButton>
            </Paper>
          </footer>
        </div>
      ) : (
        <div className="emptyBox">
          <p className="emptyBoxMsg">Select a chat room to see messages.</p>
        </div>
      )}
    </>
  );
};

export default PrivateChatBox;
