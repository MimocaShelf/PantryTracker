import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {getUser} from './pantry/getPantries.js'

function Pantry() {
  const [pantries, setPantries] = useState([]);
  const [isAddingPantry, setIsAddingPantry] = useState(false);
  const [newPantryName, setNewPantryName] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Alphabetical");
  const [recentlyUsed, setRecentlyUsed] = useState({});
  const defaultOwner = "Temporary Owner";


  let getUserID = parseInt(localStorage.getItem('user_id'));
  let user_id = (getUserID != null) ? getUserID : -1;
  
  let getUserFromUserID = getUser(user_id);
  
  let [username, setUsername] = useState(defaultOwner);
  async function updateUsername() {
    getUserFromUserID.then(data => {
      setUsername(data.name);
    })
  }

  useEffect(() => {
    updateUsername();
  })
  // Add new pantry
  const handleAddPantry = async (e) => {
    e.preventDefault();
    if (newPantryName.trim()) {



      try {
        const response = await fetch('http://localhost:3001/addPantry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pantry_owner: username,
            pantry_name: newPantryName
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${errorText}`);
        }

        const result = await response.json();
        console.log("Pantry added:", result);

        const updated = await fetch('http://localhost:3001/postGetPantriesForUser', {
          method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user_id,
            })

        });
        const data = await updated.json();
        setPantries(data);

        setConfirmation(`Pantry "${newPantryName}" added!`);
        setTimeout(() => setConfirmation(""), 3000);

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
    fetch('http://localhost:3001/postGetPantriesForUser', {
          method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user_id,
            })

        })
      .then(res => res.json())
      .then(data => setPantries(data))
      .catch(err => console.error("Error fetching pantries:", err));

    // Load recently used from localStorage
    const storedUsage = localStorage.getItem("recentlyUsed");
    if (storedUsage) {
      setRecentlyUsed(JSON.parse(storedUsage));
    }
  }, []);

  // Delete pantry and show name in confirmation
  const handleDeletePantry = async (id, name) => {
    try {
      const response = await fetch(`http://localhost:3001/deletePantry/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPantries(prev => prev.filter(p => p.pantry_id !== id));
        setConfirmation(`Pantry "${name}" deleted!`);
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

  //Filter pantries by search query
  const filteredPantries = pantries.filter(pantry =>
    pantry.pantry_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort pantries based on selected option
  const sortedPantries = [...filteredPantries];
  if (sortOption === "Alphabetical") {
    sortedPantries.sort((a, b) =>
      a.pantry_name.localeCompare(b.pantry_name)
    );
  } else if (sortOption === "RecentlyCreated") {
    sortedPantries.sort((a, b) =>
      b.pantry_id - a.pantry_id 
    );
  } else if (sortOption === "RecentlyUsed") {
    sortedPantries.sort((a, b) =>
      (recentlyUsed[b.pantry_id] || 0) - (recentlyUsed[a.pantry_id] || 0)
    );
  }

  return (
    <div>
      <div className="section">
        <h1>Pantry Page</h1>
        <p>Create and store all your pantries here!</p>
        <p>Click on your pantries to see ingredients/items you've stored</p>
      </div>

      <div className="pantryInput-field">
        <input
          id="pantrySearch"
          placeholder="Search for Pantry..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className="createPantryButton" onClick={() => setIsAddingPantry(true)}>+ Create New Pantry</button>
        <label>
          Sort Pantry:
          <select className="pantry-dropdown" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="Alphabetical">Alphabetical</option>
            <option value="RecentlyCreated">Recently Created</option>
            <option value="RecentlyUsed">Recently Used</option>
          </select>
        </label>

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
        {sortedPantries.length > 0 ? (
          sortedPantries.map(pantry => (
            <div className="pantryCard" key={pantry.pantry_id}>
              <h2><b>{pantry.pantry_name}</b></h2>
              <p id="cardText">Owner : {pantry.pantry_owner}</p>
              <p id="cardText">Items : {pantry.pantry_itemAmount}</p>
              <div className="pantry-actions">
                <Link to={`/pantryview`}>
                  <button
                    onClick={() => {
                      localStorage.setItem("pantry_id", pantry.pantry_id);
                      const updatedUsage = {
                        ...recentlyUsed,
                        [pantry.pantry_id]: Date.now()
                      };
                      setRecentlyUsed(updatedUsage);
                      localStorage.setItem("recentlyUsed", JSON.stringify(updatedUsage));
                    }}>View Pantry</button>
                </Link>
                <button onClick={() => handleDeletePantry(pantry.pantry_id, pantry.pantry_name)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No pantries match your search.</p>
        )}
      </div>
    </div>
  );
}

export default Pantry;