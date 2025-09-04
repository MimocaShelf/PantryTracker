import React from 'react';

function Pantry() {
    return (
        <div>
            <div class="section">
            <h1>Pantry Page</h1>
            <p>See your created pantry/pantries below</p>
            <p>Or create your own pantry!</p>
            </div>

            <div class='pantrySearch'>
                <input id="search-bar" placeholder='Search...' type="text"/>
                <button id="pantryButton">+ Create New Pantry</button>
                <button id="pantrySortButton">Sort Pantry
                    <select>
                        <option>Alphabetical</option>
                        <option>Recently Used</option>
                        <option>Recently Created</option>
                    </select>

                </button>
            </div>


            <div class="pantryCards">
                <div className="pantryCard">
                     <div class="container">
                        <h2><b>Main Pantry</b></h2>
                        <p>Owner: Jane Doe</p>
                    </div>
                </div>  

                <div className="pantryCard">
                     <div class="container">
                        <h2><b>Fridge</b></h2>
                        <p>Owner: Jane Doe</p>
                    </div>
                </div>

                <div className="pantryCard">
                     <div class="container">
                        <h2><b>Sink</b></h2>
                        <p>Owner: Jane Doe</p>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Pantry;