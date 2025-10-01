import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function MealPrep() {
    const navigate = useNavigate();
    const [breakfastItems, setBreakfastItems] = useState([]);
    const [lunchItems, setLunchItems] = useState([]);
    const [dinnerItems, setDinnerItems] = useState([]);

    const [breakfastRecipe, setBreakfastRecipe] = useState([]);
    const [lunchRecipe, setLunchRecipe] = useState([]);
    const [dinnerRecipe, setDinnerRecipe] = useState([]);

    //Function that removes the record of the pantry item with the specific meal time in the meal prep table 
    function removePantryItem(itemName, time){

        //Removes the pantry item from its corresponding meal list
        if(time === 1){
            setBreakfastItems(prev => prev.filter(item => item.itemName !== itemName));
        } else if (time === 2){
            setLunchItems(prev => prev.filter(item => item.itemName !== itemName));
        } else if (time === 3){
            setDinnerItems(prev => prev.filter(item => item.itemName !== itemName));
        }

        console.log(lunchItems);

        //Request the backend server to remove the meal record that corresponds to the item name and meal time from the database
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
            console.log(data.message)
          getRecipe() //Updates the recommended recipe to match the current ingredients in the meal plan 
        })
        .catch(err => console.error('Error sending data: ', err))
        
    }

    //Function that request the backend database to call the recipe API for each meal time based on list of pantry item
    function getRecipe() {
        fetch('http://localhost:3001/getRecipe')
        .then(res => res.json())
        .then(data => {
            setBreakfastRecipe(data.breakfastRecipe);
            setLunchRecipe(data.lunchRecipe);
            setDinnerRecipe(data.dinnerRecipe);
        })
        .catch(err => console.error('Error: ', err))
    }

    //Fetches lists of pantry items for each meal time
     useEffect(() => {
        fetch('http://localhost:3001/getMealPrep')
        .then(res => res.json())
        .then(data => {
          setBreakfastItems(data.breakfastItems); //Update the state with the list of pantry items set for breakfast as it meal time
          setLunchItems(data.lunchItems); //Update the state with the list of pantry items set for lunch as it meal time
          setDinnerItems(data.dinnerItems); //Update the state with the list of pantry items set for dinner as it meal time
        })
        .catch(err => console.error('Error: ', err))
      }, [])

    //Fetches recommended recipe for each meal plan
    useEffect(() => {
        fetch('http://localhost:3001/getRecipe')
        .then(res => res.json())
        .then(data => { //Updates the state with a recipe object
            setBreakfastRecipe(data.breakfastRecipe);
            setLunchRecipe(data.lunchRecipe);
            setDinnerRecipe(data.dinnerRecipe);
        })
        .catch(err => console.error('Error: ', err))
    }, [])

    //Function that renders the list of pantry items with its nutrition values for each meal time
    function renderMealTimeItems(mealTime, mealItems) {

        //Checks if the list of pantry items is empty
        if(mealItems.length === 0){
            return <p class="warning-message">You have no ingredients set.</p>
        }

        //Else return the formatted list of pantry items
        //Goes through each item in the list of pantry items
        return mealItems.map((item, index) => (
            <div key={index} class="row">
                <div class="left-container">
                    <h2>{item.itemName}</h2>
                </div>
                <div class="right-container">
                    <h3>Calories: {item.calories}</h3>
                    <h3 id="purple-text">Protein: {item.protein}</h3>
                    <h3 id="pink-text">Carbs: {item.carbohydrate}</h3>
                    <h3 id="lavender-text">Fats: {item.fats}</h3>
                    <button class="search-bar-button" onClick={() => removePantryItem(item.itemName, mealTime)}>Remove</button>
                </div>
            </div>
        ))
    }

    //Function that renders the recipe
    function renderRecipes(mealName, recipeList) {

        //Checks if the recipe object is undefined, indicating there is no pantry items set for that meal time
        if(recipeList === undefined){
            return <div class="mealTimes">
                        <h2>For {mealName}: <em>No items in meal prep...</em></h2>
                    </div>
        
        //Check if the recipe object has no items inside, indicating there was no suitable recipe generated by the Recipe API
        } else if(recipeList.length === 0) {
            return <div class="mealTimes">
                        <h2>For {mealName}: <em>No suitable recipes found...</em></h2>
                    </div>
        }

        //Else return the formatted recipe object
        return recipeList.map((item, index) => (
            <div key={index} class="mealTimes">
                <h2>For {mealName}: {item.title}</h2>
                <p><bold>Serving:</bold> {item.servings}</p>
                <p><bold>Ingredients:</bold> {item.ingredients}</p>
                <div class="right-aligned">
                <button class="search-bar-button" onClick={() => alert('Feature not yet available...')}>Start Cooking</button>
                </div>
            </div>
        ))
    }

    return (
        <div>
            <div class="section">
                <h1>Meal Prep</h1>
                <p>Check which ingredients you set to your meal plan and generate recipes to help you cook easy but nutritious meals</p>
                <button onClick={() => navigate('/nutrition')}>Nutrition Tracker</button>  
            </div>

                <div class="mealTimes">
                    <h2>Breakfast</h2>
                    {renderMealTimeItems(1, breakfastItems)}
                </div>
                <div class="mealTimes">
                    <h2>Lunch</h2>
                    {renderMealTimeItems(2, lunchItems)}
                </div>
                <div class="mealTimes">
                    <h2>Dinner</h2>
                    {renderMealTimeItems(3, dinnerItems)}
                </div>
                
            <div class="section">
                <h1>Recommended Recipes</h1>
                <p>See a list of recipes we recommend for each of your meal time today</p>
            </div>
            {renderRecipes("Breakfast",breakfastRecipe)}
            {renderRecipes("Lunch", lunchRecipe)}            
            {renderRecipes("Dinner", dinnerRecipe)}
            
        </div>
    );
}

export default MealPrep;