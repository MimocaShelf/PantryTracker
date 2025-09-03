import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home.jsx';
import Nutrition from './nutrition.jsx';
import MealPrep from './mealPrep.jsx';
import React from 'react';

function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/mealPrep" element={<MealPrep />} />
        </Routes>
        </BrowserRouter>
    );
}

export default App;