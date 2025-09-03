import React, { useState } from 'react';
import Nutrition from './nutrition';

function MealPrepManager() {
    const [mealPlans, setMealPlans] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
    });

    const handleAddToMealPrep = (ingredient, mealPlan) => {
        setMealPrep(prev => ({
            ...prev, [mealPlan]: [...prev[mealPlan], ingredient],
        }));
    };

    //return ();
    //return <div> container depicting the different meal plans
}