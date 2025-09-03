import React from 'react';

function Nutrition() {
    return (
        <div>
            <div class="section">
            <h1>Nutrition Page</h1>
            <p>See the list of pantry items you have and their nutritional values.</p>
            <p>Add ingredients certain items to your meal plan to help generate recipes for breakfast, lunch and dinner</p>
            </div>
            <div class='input-field'>
                <input id="search-bar" placeholder='Search...' type="text"/>
                <button>Ingredient List</button>
                <button>Weekly Meal Plan</button>
            </div>
            <div class="nutritionBox">
                <div class="row">
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
                <div class="right-aligned">
                <button>Add To Meal Prep</button>
                <select name="times">
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                </select>
                </div>
                
            </div>
            <div class="nutritionBox">
                <div class="row">
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

                 <div class="right-aligned">
                <button>Add To Meal Prep</button>
                <select name="times">
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                </select>
                </div>
            </div>
        </div>
       

    );
}

export default Nutrition;