import React from 'react';
import { Link } from 'react-router-dom';


function Home() {
    return (
    <div>
        <h1>Welcome To Home Page</h1>
        <nav>
            <ul>
                <li><Link to="/pantry">Go to Pantry</Link></li>
                <li><Link to="/nutrition">Go to Nutrition</Link></li>
                <li><Link to="/mealPrep">Go to Meal Prep</Link></li>
                <li><Link to="/user">Go to User</Link></li>
                <li><Link to="/shoppingList">Go to Shopping List</Link></li>
            </ul>
        </nav>

    </div>
    );
}

export default Home;