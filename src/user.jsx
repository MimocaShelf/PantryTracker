
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function User() {
    // State for user information
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserData, setEditedUserData] = useState({...userData});
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // Fetch user data from backend
    React.useEffect(() => { 

        const fetchUserData = async () => {
            // Replace with actual API call
            const user = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123"
            };
            setUserData(user);
            setEditedUserData(user);
        };
        fetchUserData();
    }, []);

    if (!userData) {
        return <div>Loading...</div>;
    }

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setUserData(editedUserData);
        setIsEditing(false);
    };
    
    return (
        <div>
            <div className="section">
                <h1>User Profile</h1>
                <p>Manage your profile information and pantries</p>
            </div>

            <Link to="/household">Manage Household</Link>

            <div className="section">
                <h2>Profile Information</h2>
                {isEditing ? (
                    <form onSubmit={handleEditSubmit}>
                        <div className="input-field">
                            <label htmlFor="name">Name:</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={editedUserData.name}
                                onChange={(e) => setEditedUserData({...editedUserData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="email">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={editedUserData.email}
                                onChange={(e) => setEditedUserData({...editedUserData, email: e.target.value})}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="profilePicture">Profile Picture URL:</label>
                            <input 
                                type="url" 
                                id="profilePicture" 
                                value={editedUserData.profilePicture}
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

        </div>
    );
}

export default User;
