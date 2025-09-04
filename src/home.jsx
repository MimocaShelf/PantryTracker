import React from 'react';
import { Link } from 'react-router-dom';


function Home() {
    return (
    <div>
        <h1>Pantry Tracker Home Page</h1>
        <nav>
            <ul>
                <li id="homeList"><Link to="/pantry">Go to Pantry</Link></li>
                <li id="homeList"><Link to="/nutrition">Go to Nutrition</Link></li>
                <li id="homeList"><Link to="/mealPrep">Go to Meal Prep</Link></li>
                <li id="homeList"><Link to="/user">Go to User</Link></li>
                <li id="homeList"><Link to="/shoppingList">Go to Shopping List</Link></li>
            </ul>
        </nav>

    </div>
    );
}

export default Home;