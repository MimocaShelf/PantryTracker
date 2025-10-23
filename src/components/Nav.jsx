import React, {useContext} from 'react';
import {NavLink, Link} from 'react-router-dom';
import UserContext from '../context/UserContext';
import Logout from '../logout.jsx';
import toast from 'react-hot-toast';

// Function to notify user when they log out
const notify = (message) => toast.success(message, {
    duration: 2000,
    position: "bottom-right",
    autoClose: true,
});
const Nav = () => {

    // Get user data from UserContext
    const [userData, setUserData] = useContext(UserContext);

    return (
        <nav>
            <ul id="homeList">
                <li id=""><Link to="/">Home</Link></li>
                <li id=""><Link to="/pantry">Pantry</Link></li>
                <li id=""><Link to="/nutrition">Nutrition</Link></li>
                <li id=""><Link to="/recipe">Recipe</Link></li>
                <li id=""><Link to="/shoppingList">Shopping List</Link></li>
                <li id=""><Link to="/shoppingMode">Shopping Mode</Link></li>
                <li id=""><Link to="/priceCompare">Price Compare</Link></li>
                <li id=""><Link to="/calendar">Calendar Meal Planner</Link></li>

                {
                    (userData) ? 
                        <span>
                            <li id=""><Link to="/user">User</Link></li>
                            <li id=""><Link to="/logout" onClick={() => Logout().then(notify("Successfully logged out."))}>Logout</Link></li>
                        </span> :

                        <span>
                            <li id=""><Link to="/login">Login</Link></li>
                            <li id=""><Link to="/signup">Signup</Link></li>
                        </span>
                }
            </ul>
        </nav>
    );
}

export default Nav;