import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { db, collection, addDoc, serverTimestamp, getDocs, where, query } from '../../firebase';
import { useStateValue } from './stateProvider';
import { useHistory } from 'react-router';

export default function AddNewChat() {
  const history = useHistory();
  const [{ user }] = useStateValue();
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [showUsersList, setShowUsersList] = useState(false);
  const capitalize = (str) => str && str[0].toUpperCase() + str.slice(1).toLowerCase();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleClickOpen = (isPrivateChat) => {
    setOpen(true);
    if (isPrivateChat) {
      setShowUsersList(true);
      setUsers(users.filter((u) => u.uid !== user.uid));
    } else {
      setShowUsersList(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  const createChatRoom = () => {
    if (roomName) {
      if (!showUsersList) {
        // Create a general chat room
        addDoc(collection(db, 'chatRooms'), {
          creator: user.uid,
          name: capitalize(roomName),
          participants: [user.uid],
          timestamp: serverTimestamp(),
        })
          .then((docRef) => {
            const roomId = docRef.id;
            history.push(`/rooms/${roomId}`);
          })
          .catch((error) => {
            console.error('Error creating chat room:', error);
          });
      } else if (selectedUser) {
        // Find an existing private chat room between the two participants
        const chatRoomsRef = collection(db, 'chatRooms');
        const q1 = query(chatRoomsRef, where('participants', 'array-contains', user.uid));
        const q2 = query(chatRoomsRef, where('participants', 'array-contains', selectedUser));
        Promise.all([getDocs(q1), getDocs(q2)])
          .then(([querySnapshot1, querySnapshot2]) => {
            const commonRooms = querySnapshot1.docs.filter((doc1) => {
              return querySnapshot2.docs.some((doc2) => doc2.id === doc1.id);
            });
            if (commonRooms.length > 0) {
              // If a common private chat room exists, navigate to it
              const roomId = commonRooms[0].id;
              history.push(`/rooms/${roomId}`);
            } else {
              // If no common private chat room exists, create a new one
              const participants = [user.uid, selectedUser];
              addDoc(collection(db, 'chatRooms'), {
                creator: user.uid,
                name: capitalize(roomName),
                participants,
                timestamp: serverTimestamp(),
              })
                .then((docRef) => {
                  const roomId = docRef.id;
                  history.push(`/rooms/${roomId}`);
                })
                .catch((error) => {
                  console.error('Error creating private chat:', error);
                });
            }
          })
          .catch((error) => {
            console.error('Error finding private chat room:', error);
          });
      }
    }

    setRoomName('');
    setSelectedUser('');
    setOpen(false);
  };
  
  return (
    <div style={{ display: 'inline-block' }}>
      <Button
        sx={{
          fontSize: '1.5rem',
          borderTop: '1px solid #fff',
          borderBottom: '1px solid #fff',
          width: '100%',
        }}
        variant="text"
        aria-label="add new chat"
        onClick={() => handleClickOpen(false)}
      >
        create new chat room
      </Button>
      <Button
        sx={{
          fontSize: '1.5rem',
          borderTop: '1px solid #fff',
          borderBottom: '1px solid #fff',
          width: '100%',
        }}
        variant="text"
        aria-label="start private chat"
        onClick={() => handleClickOpen(true)}
      >
        start private chat
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Chat</DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <DialogContentText>
            Please enter the name of the chat room you want to create and select a user to start a private chat.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          {showUsersList && (
            <DialogContentText style={{ marginTop: '1rem' }}>Select a user:</DialogContentText>
          )}
          {showUsersList && (
            <div>
              {users.map((u) => (
                <Button
                  key={u.uid}
                  variant={selectedUser === u.uid ? 'contained' : 'outlined'}
                  onClick={() => handleUserSelect(u.uid)}
                  disabled={selectedUser && selectedUser !== u.uid}
                >
                  {u.displayName}
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: '#000' }} aria-label="cancel" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            aria-label="create"
            onClick={createChatRoom}
            disabled={!roomName || (showUsersList && !selectedUser)}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
