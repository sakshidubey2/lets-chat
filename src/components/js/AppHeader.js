import React from 'react';
import { auth, signOut } from '../../firebase';
import { useStateValue } from './stateProvider';
import { actionTypes } from './reducer';
import { Box } from '@mui/system';
import logo from '../../logo.png';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";

function SideBox() {
    const [{ }, dispatch] = useStateValue();

    const signOutHandler = () => {
        signOut(auth).then(() => {
            dispatch({
                type: actionTypes.SET_USER,
                user: null,
            });
        }).catch((err) => {
            alert(err.message);
        });
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1 className="app_title">
                <img src={logo} alt="app logo" className="app_logo" />
                ChatApp
            </h1>
            <Link to='/' style={{ textDecoration: 'none' }}>
                Logout
                <IconButton aria-label="sing out" onClick={signOutHandler}>
                    <LogoutIcon fontSize="large" />
                </IconButton>
            </Link>
        </Box>
    );
}

export default SideBox;