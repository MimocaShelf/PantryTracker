import React, { useState, useEffect } from 'react';

function MealPrep() {
    const [breakfastItems, setBreakfastItems] = useState([]);
    const [lunchItems, setLunchItems] = useState([]);
    const [dinnerItems, setDinnerItems] = useState([]);

    function removePantryItem(itemName, time){

        if(time === 1){
            setBreakfastItems(prev => prev.filter(item => item.itemName !== itemName));
        } else if (time === 2){
            setLunchItems(prev => prev.filter(item => item.itemName !== itemName));
        } else if (time === 3){
            setDinnerItems(prev => prev.filter(item => item.itemName !== itemName));
        }

        fetch('http://localhost:3001/removeMealPrepItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            itemName: itemName,
            time: time
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log('Response from backend:', data);
          
        })
        .catch(err => console.error('Error sending data: ', err))
    }

     useEffect(() => {
        fetch('http://localhost:3001/getMealPrep')
        .then(res => res.json())
        .then(data => {
          console.log('Breakfast Item: ', data.breakfastItems);
          console.log('Lunch Item: ', data.lunchItems);
          console.log('Dinner Item: ', data.dinnerItems);
          setBreakfastItems(data.breakfastItems);
          setLunchItems(data.lunchItems);
          setDinnerItems(data.dinnerItems);
        })
        .catch(err => console.error('Error: ', err))
      }, [])


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
                {breakfastItems.map((item, index) => (
                <div key={index} class="row">
                <div class="left-container">
                    <h2>{item.itemName}</h2>
                </div>
                <div class="right-container">
                    <h3>Calories: {item.calories}</h3>
                    <h3 id="purple-text">Protein: {item.protein}</h3>
                    <h3 id="pink-text">Carbs: {item.carbohydrate}</h3>
                    <h3 id="lavender-text">Fats: {item.fats}</h3>
                    <button onClick={() => removePantryItem(item.itemName, 1)}>Remove</button>
                    <button>Generate Recipes</button>
                </div>
                </div>
                ))}
            </div>
            

            <div class="mealTimes">
                <h2>Lunch</h2>
                <div class="total">
                    <h3>Total Calories: 155</h3>
                    <h3 id="purple-text">Total Protein: 8.5</h3>
                    <h3 id="pink-text">Total Carbs: 11.0</h3>
                    <h3 id="lavender-text">Total Fats: 8.5</h3>
                </div>
                {lunchItems.map((item, index) => (
                <div key={index} class="row">
                <div class="left-container">
                    <h2>{item.itemName}</h2>
                </div>
                <div class="right-container">
                    <h3>Calories: {item.calories}</h3>
                    <h3 id="purple-text">Protein: {item.protein}</h3>
                    <h3 id="pink-text">Carbs: {item.carbohydrate}</h3>
                    <h3 id="lavender-text">Fats: {item.fats}</h3>
                    <button>Remove</button>
                    <button>Generate Recipes</button>
                </div>
                </div>
                ))}
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