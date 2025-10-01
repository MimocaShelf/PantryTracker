import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home.jsx';
import Nutrition from './nutrition.jsx';
import MealPrep from './nutrition management/mealPrep.jsx';
import Pantry from './pantry.jsx';
import AddToPantry from './pantry/addToPantry.jsx';
import PantryView from './pantry/pantryView.jsx';
import User from './user.jsx';
import Household from './household.jsx';
import ShoppingList from './shoppingList.jsx';
import Login from './login.jsx';
import Signup from './signup.jsx';
import React from 'react';
import ShoppingMode from "./ShoppingMode.jsx";
import NutritionLogic from "./nutrition management/nutritionLogic.jsx";
// import './sql/app.js';
// import './nutritionLogic.js';

function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nutrition" element={<NutritionLogic />} />
            <Route path="/mealPrep" element={<MealPrep />} />
            <Route path="/pantry" element={<Pantry />} />
            <Route path="/addToPantry" element={<AddToPantry />} />
            <Route path="/user" element={<User />} />
            <Route path="/household" element={<Household />} />
            <Route path="/shoppingList" element={<ShoppingList />} />
            <Route path="/shoppingMode" element={<ShoppingMode />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pantryView" element={<PantryView />} /> 
        </Routes>
        </BrowserRouter>
    );
}

export default App;