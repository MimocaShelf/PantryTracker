import {NavLink} from 'react-router-dom';

const Nav = () => {
    return (
        <nav>
            <NavLink exact to="/">Home</NavLink>
            <NavLink to="/pantry">Pantry</NavLink>
            <NavLink to="/shopping-list">Shopping List</NavLink>
            <NavLink to="/nutrition-management">Nutrition Management</NavLink>
        </nav>
    );
}

export default Nav;