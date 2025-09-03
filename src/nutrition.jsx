import React from 'react';

function Nutrition() {
    return (
        <div>
            <h1>Welcome To Nutrition Page</h1>
            <div class='input-field'>
                <input id="search-bar" placeholder='Search...' type="text"/>
                <button>Ingredient List</button>
                <button>Weekly Meal Plan</button>
            </div>
            <div class="nutritionBox">
                <div class="left-container">
                    <h2>Milk</h2>
                </div>
                <div class="right-container">
                    <h3>Calories: 155</h3>
                    <h3 id="purple-text">Protein: 8.5</h3>
                    <h3 id="pink-text">Carbs: 11.0</h3>
                    <h3 id="lavender-text">Fats: 8.5</h3>
                </div>
            </div>
            <div class="nutritionBox">
                <div class="left-container">
                    <h2>Oats</h2>
                </div>
                <div class="right-container">
                    <h3>Calories: 231</h3>
                    <h3 id="purple-text">Protein: 6.2</h3>
                    <h3 id="pink-text">Carbs: 31.8</h3>
                    <h3 id="lavender-text">Fats: 1.4</h3>
                </div>
            </div>
        </div>
       

    );
}

export default Nutrition;