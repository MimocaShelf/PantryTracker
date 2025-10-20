import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home.jsx';
import Nutrition from './nutrition.jsx';
import MealPrep from './nutrition management/mealPrep.jsx';
import Recipe from './recipe management/recipe.jsx';
import SavedRecipe from './recipe management/savedRecipe.jsx';
import Pantry from './pantry.jsx';
import AddToPantry from './pantry/addToPantry.jsx';
import PantryView from './pantry/pantryView.jsx';
import User from './user.jsx';
import Household from './household.jsx';
import ShoppingList from './shoppingList.jsx';
import Login from './login.jsx';
import Signup from './signup.jsx';
import React from 'react';
import ShoppingMode from "./shoppingMode.jsx";
import NutritionLogic from "./nutrition management/nutritionLogic.jsx";
import PriceCompare from "./priceCompare.jsx";
import CalendarPage from "./calendar.jsx";
import Nav from "./components/Nav.jsx";
import UserContext from "./context/UserContext.jsx";
import { useState } from "react";
import PantrySummary from "./pantry/pantrySummary.jsx";
// import './sql/app.js';
// import './nutritionLogic.js';

function App() {

    // Add context for user to be passed to the rest of the application.
    const [userData, setUserData] = useState([]);

    return (
        <UserContext value={[ userData, setUserData ]}>
            <BrowserRouter>
                <Nav />  {/* Navigation bar */}

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/nutrition" element={<NutritionLogic />} />
                    <Route path="/mealPrep" element={<MealPrep />} />
                    <Route path="/recipe" element={<Recipe />} />
                <Route path="/savedRecipe" element={<SavedRecipe />} />
                    <Route path="/pantry" element={<Pantry />} />
                    <Route path="/addToPantry" element={<AddToPantry />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/household" element={<Household />} />
                    <Route path="/shoppingList" element={<ShoppingList />} />
                    <Route path="/shoppingMode" element={<ShoppingMode />} /> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/pantryView" element={<PantryView />} /> 
                    <Route path="/priceCompare" element={<PriceCompare />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/pantrySummary" element={<PantrySummary />} />
                </Routes>
            </BrowserRouter>
        </UserContext>
    );
}

export default App;