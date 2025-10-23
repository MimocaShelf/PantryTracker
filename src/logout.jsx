import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import User from './user';
import toast from 'react-hot-toast';
import UserContext from './context/UserContext';

const notify = (message) => toast(message);
async function Logout() {

    const [userData, setUserData] = useContext(UserContext);
    const navigate = useNavigate();

    // Clear local storage and navigate to login page
    localStorage.removeItem('user_id');
    setUserData(null);
    navigate('/login');
}

export default Logout;