import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function Pantry() {
const [isAddingPantry, setIsAddingPantry] = useState(false);
const [newPantryName, setNewPantryName] = useState("");
const [pantries, setUserPantries] = useState([
    { id: 1, name: "Main Pantry", itemCount: 12 },
    { id: 2, name: "Fridge", itemCount: 8 },
    { id: 3, name: "Sink", itemCount: 3 },
]);


    const handleAddPantry = (e) => {
        e.preventDefault();
        if (newPantryName.trim()) {
            const newPantry = {
                id: pantries.length + 1,
                name: newPantryName,
                itemCount: 0
            };
            setUserPantries([...pantries, newPantry]);
            setNewPantryName("");
            setIsAddingPantry(false);
        }
    };

    const handleDeletePantry = (pantryId) => {
        setUserPantries(pantries.filter(pantry => pantry.id !== pantryId));
    };

    return (
        <div>
            <div className="section">
            <h1>Pantry Page</h1>
            <p>See your created pantry/pantries below</p>
            <p>Or create your own pantry!</p>
            </div>

            <div className='pantrySearch'>
                <input id="search-bar" placeholder='Search for Pantry...' type="text"/>
                <button id="pantryButton" onClick={() => setIsAddingPantry(true)}>+ Create New Pantry</button>
                
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

                <button id="pantrySortButton">Sort Pantry
                    <select>
                        <option>Alphabetical</option>
                        <option>Recently Used</option>
                        <option>Recently Created</option>
                    </select>

                </button>
            </div>

            <div className="pantryCards">
                {pantries.map(pantry => (
                    <div className="pantryCard" key={pantry.id}>
                        <h2><b>{pantry.name}</b></h2>
                        <p id="cardText">Owner : Jane Doe</p>
                        <p id="cardText"> Items : {pantry.itemCount}</p>
                        <div className="pantry-actions">
                            <Link to={`/pantry/${pantry.id}`}>
                                <button>View Items</button>
                            </Link>
                            <button onClick={() => handleDeletePantry(pantry.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

        </div>

    );
}

export default Pantry;