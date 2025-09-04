import React from 'react';

function Pantry() {
    return (
        <div>
            <div class="section">
            <h1>Pantry Page</h1>
            <p>See your created pantry/pantries below</p>
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