
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function User() {
    // Mock user data
    const [userData, setUserData] = useState({
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        profilePicture: "https://via.placeholder.com/150",
    });

    // Mock pantries data
    const [userPantries, setUserPantries] = useState([
        { id: 1, name: "Main Pantry", itemCount: 12 },
        { id: 2, name: "Fridge", itemCount: 8 },
        { id: 3, name: "Sink", itemCount: 3 },
    ]);

    // State for form editing
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserData, setEditedUserData] = useState({...userData});
    
    // State for new pantry form
    const [isAddingPantry, setIsAddingPantry] = useState(false);
    const [newPantryName, setNewPantryName] = useState("");

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setUserData(editedUserData);
        setIsEditing(false);
    };

    const handleAddPantry = (e) => {
        e.preventDefault();
        if (newPantryName.trim()) {
            const newPantry = {
                id: userPantries.length + 1,
                name: newPantryName,
                itemCount: 0
            };
            setUserPantries([...userPantries, newPantry]);
            setNewPantryName("");
            setIsAddingPantry(false);
        }
    };

    const handleDeletePantry = (pantryId) => {
        setUserPantries(userPantries.filter(pantry => pantry.id !== pantryId));
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
            
            <div className="section">
                <h2>Your Pantries</h2>
                <button onClick={() => setIsAddingPantry(true)}>+ Create New Pantry</button>
                
                {isAddingPantry && (
                    <form onSubmit={handleAddPantry} className="input-field">
                        <input 
                            type="text" 
                            placeholder="Pantry Name" 
                            value={newPantryName}
                            onChange={(e) => setNewPantryName(e.target.value)}
                            required
                        />
                        <button type="submit">Create</button>
                        <button type="button" onClick={() => setIsAddingPantry(false)}>Cancel</button>
                    </form>
                )}

                <div className="pantryCards">
                    {userPantries.map(pantry => (
                        <div className="pantryCard" key={pantry.id}>
                            <div className="container">
                                <h2><b>{pantry.name}</b></h2>
                                <p>Items: {pantry.itemCount}</p>
                                <div className="pantry-actions">
                                    <Link to={`/pantry/${pantry.id}`}>
                                        <button>View Items</button>
                                    </Link>
                                    <button onClick={() => handleDeletePantry(pantry.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}

export default User;
