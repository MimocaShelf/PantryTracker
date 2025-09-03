import React from 'react';

function MealPrep() {
    return (
        <div>
            <div class="section">
            <h1>Meal Prep</h1>
            <p>Check which ingredients you set to your meal plan and generate recipes to help you cook easy but nutritious meals</p>
            </div>
            <div class="section">
            <div class="mealTimes">
                <h2>Breakfast</h2>
                <div class="total">
                    <h3>Total Calories: 155</h3>
                    <h3 id="purple-text">Total Protein: 8.5</h3>
                    <h3 id="pink-text">Total Carbs: 11.0</h3>
                    <h3 id="lavender-text">Total Fats: 8.5</h3>
                </div>
                <div class="row">
                <div class="left-container">
                    <h2>Milk</h2>
                </div>
                <div class="right-container">
                    <h3>Calories: 155</h3>
                    <h3 id="purple-text">Protein: 8.5</h3>
                    <h3 id="pink-text">Carbs: 11.0</h3>
                    <h3 id="lavender-text">Fats: 8.5</h3>
                    <button>Remove</button>
                    <button>Generate Recipes</button>
                </div>
                </div>
                
            </div>
            <div class="mealTimes">
                <h2>Lunch</h2>
                <p class="warning">You have no set recipes for lunch</p>
            </div>
            <div class="mealTimes">
                <h2>Dinner</h2>
                <p class="warning">You have no set recipes for lunch</p>
            </div>
            </div>

            <h1>Recipes</h1>
            <div class="mealTimes">
                <h2>Pancakes</h2>
                <p>Fluffy, round cakes made from a milk-based batter, cooked on a griddle and often served with syrup, butter, or fruit.</p>
                <div class="right-aligned">
                <button>Start Cooking &gt;</button>
                </div>
            </div>
            <div class="mealTimes">
                <h2>Oatmeal</h2>
                <p>Warm, creamy porridge made by simmering oats in milk, commonly topped with fruits, nuts, or sweeteners like honey.</p>
                <div class="right-aligned">
                <button>Start Cooking &gt;</button>
                </div>
            </div>
            <div class="mealTimes">
                <h2>French Toast</h2>
                <p>Slices of bread dipped in a milk and egg mixture, then fried until golden brown; usually served with syrup, powdered sugar, or fruit.</p>
                <div class="right-aligned">
                <button>Start Cooking &gt;</button>
                </div>
            </div>
        </div>
    );
}

export default MealPrep;