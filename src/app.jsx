import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home.jsx';
import Nutrition from './nutrition.jsx';
import MealPrep from './mealPrep.jsx';
import Pantry from './pantry.jsx';
import React from 'react';

function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/mealPrep" element={<MealPrep />} />
            <Route path="/pantry" element={<Pantry />} />
        </Routes>
        </BrowserRouter>
    );
}

export default App;