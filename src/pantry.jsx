import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Pantry() {
  const [pantries, setPantries] = useState([]);
  const [isAddingPantry, setIsAddingPantry] = useState(false);
  const [newPantryName, setNewPantryName] = useState("");
  const [confirmation, setConfirmation] = useState("");


  // Add new pantry
  const handleAddPantry = async (e) => {
    e.preventDefault();
    if (newPantryName.trim()) {
      const defaultOwner = "Temporary Owner";

      try {
        const response = await fetch('http://localhost:3001/addPantry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pantry_owner: defaultOwner,
            pantry_name: newPantryName
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${errorText}`);
        }

        const result = await response.json();
        console.log("Pantry added:", result);

        // Refresh pantry list
        const updated = await fetch('http://localhost:3001/getAllPantries');
        const data = await updated.json();
        setPantries(data);

        // Show confirmation
        setConfirmation(`Pantry "${newPantryName}" added!`);
        setTimeout(() => setConfirmation(""), 3000);

        // Reset form
        setNewPantryName("");
        setIsAddingPantry(false);
      } catch (err) {
        console.error("Error adding pantry:", err);
        alert("Failed to add pantry. Please try again.");
      }
    }
  };

// Load pantries from backend
  useEffect(() => {
    fetch('http://localhost:3001/getAllPantries')
      .then(res => res.json())
      .then(data => setPantries(data))
      .catch(err => console.error("Error fetching pantries:", err));
  }, []);
  
//Handle Deleting pantries from front and backend
const handleDeletePantry = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/deletePantry/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Remove pantry from state
      setPantries(prev => prev.filter(p => p.pantry_id !== id));
      setConfirmation(`Pantry "${id}" deleted!`);
      setTimeout(() => setConfirmation(""), 3000);
    } else {
      const errorText = await response.text();
      console.error("Failed to delete pantry:", errorText);
      alert("Failed to delete pantry. Please try again.");
    }
  } catch (err) {
    console.error("Error deleting pantry:", err);
    alert("Error deleting pantry. Please try again.");
  }
};

  return (
    <div>
      <div className="section">
        <h1>Pantry Page</h1>
        <p>Create and store all your pantries here!</p>
        <p>Click on your pantries to see ingredients/items you've stored </p>
      </div>

      <div class='pantryInput-field'>
        <input id="pantrySearch" placeholder="Search for Pantry..." type="text" />
        <button onClick={() => setIsAddingPantry(true)}>+ Create New Pantry</button>
        <button>Sort Pantry
          <select>
            <option>Alphabetical</option>
            <option>Recently Used</option>
            <option>Recently Created</option>
          </select>
        </button>

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
      </div>

      {confirmation && <p className="confirmation">{confirmation}</p>}

      <div className="pantryCards">
        {pantries.map(pantry => (
          <div className="pantryCard" key={pantry.pantry_id}>
            <h2><b>{pantry.pantry_name}</b></h2>
            <p id="cardText">Owner : {pantry.pantry_owner}</p>
            <p id="cardText">Items : {pantry.pantry_itemAmount}</p>
            <div className="pantry-actions">
              <Link to={`/pantry/${pantry.pantry_id}`}>  
                <button>Edit Pantry</button> 
              </Link>
              <button onClick={() => handleDeletePantry(pantry.pantry_id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
//Change edit Pantry button!!
export default Pantry;