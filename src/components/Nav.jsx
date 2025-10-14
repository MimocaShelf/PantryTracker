import React from 'react';
import {NavLink, Link} from 'react-router-dom';

const Nav = () => {
    return (
        <nav>
            <ul>
                <li id=""><Link to="/">Home</Link></li>
                <li id=""><Link to="/pantry">Pantry</Link></li>
                <li id=""><Link to="/nutrition">Nutrition</Link></li>
                <li id=""><Link to="/mealPrep">Meal Prep</Link></li>
                <li id=""><Link to="/user">User</Link></li>
                <li id=""><Link to="/shoppingList">Shopping List</Link></li>
                <li id=""><Link to="/shoppingMode">Shopping Mode</Link></li>
                <li id=""><Link to="/priceCompare">Price Compare</Link></li>
                <li id=""><Link to="/calendar">Go to Calendar Meal Planner</Link></li>
                <li id=""><Link to="/login">Login</Link></li>
                <li id=""><Link to="/signup">Signup</Link></li>

            </ul>
        </nav>
    );
}

export default Nav;