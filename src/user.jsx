
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function User() {
    // State for user information
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserData, setEditedUserData] = useState({...userData});
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // Retreive user ID from local storage
    const userId = localStorage.getItem('user_id');

    // Fetch user data from backend
    useEffect(() => { 

        const fetchUserData = async () => {

            if (!userId) {
                setUserData(null);
                return;
            }

            try {
                const res = await fetch("http://localhost:3001/user/" + userId);
                if (!res.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const user = await res.json();
                setUserData(user);
                setEditedUserData(user);
            } catch (err) {
                setUserData(null);
            }
        };
        fetchUserData();
    }, []);

    // Handles fomr submission of user data
    const handleEditSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('user_id');

    // Fallback to previous data if field is empty
    const updatedData = {
        name: editedUserData.name || userData.name,
        email: editedUserData.email || userData.email,
        profilePicture: editedUserData.profilePicture || userData.profilePicture,
    };

    try {
        // Sends PUT request to update user data
        const res = await fetch(("http://localhost:3001/user/" + userId), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!res.ok) {
            throw new Error('Failed to update user data');
        }

        const updatedUser = await res.json();
        console.log('User updated successfully:', updatedUser);

        // Reload the page after successful update
        window.location.reload();

    } catch (err) {
        alert('Error updating user profile.');
    }
};
    
    return (
        <div>
            <div className="section">
                <h1>User Profile</h1>
                <p>Manage your profile information and pantries</p>
            </div>

            {/*Conditional rendering based on whether user is logged in*/}
            {userData === null ? (
                <p>Loading user data...</p>
            ) : (
            <div className="section">
                <h2>Profile Information</h2>
                {isEditing ? (
                    <form onSubmit={handleEditSubmit}>
                        <div className="input-field">
                            <label htmlFor="name">Name:</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={editedUserData.name || ''}
                                onChange={(e) => setEditedUserData({...editedUserData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="email">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={editedUserData.email || ''}
                                onChange={(e) => setEditedUserData({...editedUserData, email: e.target.value})}
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="profilePicture">Profile Picture URL:</label>
                            <input 
                                type="url" 
                                id="profilePicture" 
                                value={editedUserData.profilePicture || ''}
                                onChange={(e) => setEditedUserData({...editedUserData, profilePicture: e.target.value})}
                            />
                        </div>
                        <div className="input-field">
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className="user-info">
                        <div className="row">
                            <div className="left-container">
                                <img 
                                    src={userData.profilePicture} 
                                    alt={`${userData.name}'s profile`} 
                                    style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                                />
                            </div>
                            <div className="right-container">
                                <h3>{userData.name}</h3>
                                <p>{userData.email}</p>
                                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            )}

            <Link to="/household">Manage Household</Link>


        </div>
    );
}

export default User;
