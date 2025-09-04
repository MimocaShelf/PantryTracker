
import React from 'react';
import { Link } from 'react-router-dom';

function Household() {
    const householdName = "Doe Family";
    const members = [
        { id: 1, name: "Jane Doe", email: "jane.doe@example.com", role: "Admin" },
        { id: 2, name: "John Doe", email: "john.doe@example.com", role: "Member" },
        { id: 3, name: "Jimmy Doe", email: "jimmy.doe@example.com", role: "Member" }
    ];

    const sharedPantries = [
        { id: 1, name: "Main Pantry", itemCount: 12, owner: "Jane Doe" },
        { id: 2, name: "Fridge", itemCount: 8, owner: "John Doe" },
        { id: 3, name: "Freezer", itemCount: 5, owner: "Jimmy Doe" },
    ];

    return (
        <div>
            <div className="section">
                <h1>Household Management</h1>
                <p>Manage your household members, shared pantries, and settings</p>
            </div>

            <div className="section">
                <div className="section-header">
                    <h2>Household Information</h2>
                    <Link to="/user">Back to Profile</Link>
                </div>
                
                <div className="household-info">
                    <div className="info-row">
                        <h3>{householdName}</h3>
                        <button className="edit-button">Edit Name</button>
                    </div>
                    <p>{members.length} members</p>
                    <p>{sharedPantries.length} shared pantries</p>
                </div>
            </div>              


            <div className="section">
                <h2>Shared Pantries</h2>
                <div className="pantryCards">
                    {sharedPantries.map(pantry => (
                        <div className="pantryCard" key={pantry.id}>
                            <div className="container">
                                <h2><b>{pantry.name}</b></h2>
                                <p>Items: {pantry.itemCount}</p>
                                <p>Owner: {pantry.owner}</p>
                                <div className="pantry-actions">
                                    <button>View Items</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h2>Household Settings</h2>
                <div className="settings-list">
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Auto-accept invitations</h3>
                            <p>Automatically accept invitations to join other households</p>
                        </div>
                        <div className="setting-control">
                            <input type="checkbox" id="autoAccept" />
                        </div>
                    </div>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Notifications</h3>
                            <p>Receive notifications when items are added or removed</p>
                        </div>
                        <div className="setting-control">
                            <input type="checkbox" id="notifications" defaultChecked />
                        </div>
                    </div>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Member invitations</h3>
                            <p>Allow members to invite others to this household</p>
                        </div>
                        <div className="setting-control">
                            <input type="checkbox" id="memberInvites" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="section danger-zone">
                <h2>Danger Zone</h2>
                <div className="danger-actions">
                    <div className="danger-action">
                        <div className="danger-info">
                            <h3>Leave Household</h3>
                            <p>You will lose access to all shared pantries</p>
                        </div>
                        <button className="danger-button">Leave Household</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Household;
