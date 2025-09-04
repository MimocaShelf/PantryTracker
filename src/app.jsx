import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home.jsx';
import Nutrition from './nutrition.jsx';
import MealPrep from './mealPrep.jsx';
import Pantry from './pantry.jsx';
import AddToPantry from './addToPantry.jsx';
import User from './user.jsx';
import ShoppingList from './shoppingList.jsx';
import React from 'react';

function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/mealPrep" element={<MealPrep />} />
            <Route path="/pantry" element={<Pantry />} />
            <Route path="/addToPantry" element={<AddToPantry />} />
            <Route path="/user" element={<User />} />
            <Route path="/shoppingList" element={<ShoppingList />} /> 
        </Routes>
        </BrowserRouter>
    );
}

export default App;