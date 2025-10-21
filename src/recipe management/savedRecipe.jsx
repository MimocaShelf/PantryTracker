import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function SavedRecipe() {
  const navigate = useNavigate();
  const [recipeValues, setRecipeValues] = useState([]);
  const [allRecipes, setAllRecipeValues] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [orderBy, setOrderBy] = useState('ascending');

    function removeRecipe(recipe){

        console.log(recipe);

        //Request the backend server to remove the meal record that corresponds to the item name and meal time from the database
        fetch('http://localhost:3001/removeRecipe', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipe: recipe
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.message)
          getSavedRecipe() //Updates the recommended recipe to match the current ingredients in the meal plan 
        })
        .catch(err => console.error('Error sending data: ', err))
        
    }

    //Function that request the backend database to call the recipe API for each meal time based on list of pantry item
    function getSavedRecipe() {
        fetch('http://localhost:3001/getSavedRecipe')
      .then(res => res.json())
      .then(data => {
        console.log('Nutrition Data:', data);
        setRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
        setAllRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
      })
      .catch(err => console.error('Error: ', err))
    }

    function slugifyName(recipe) {
        return recipe.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    }

  useEffect(() => {
      fetch('http://localhost:3001/getSavedRecipe')
      .then(res => res.json())
      .then(data => {
        console.log('Nutrition Data:', data);
        setRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
        setAllRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
      })
      .catch(err => console.error('Error: ', err))
    }, [])

  return (
    <div class="nutritionContainer">

      <div class="section">
        <h1>Saved Recipe</h1>
        <p>View all the recipes you have saved.</p>
        <p>Click on 'View More' to see more information about the recipe including instructions and list of additional ingredients needed to complete the meal</p>
        <button onClick={() => navigate('/recipe')}>All Recipes</button>  
      </div>

      {recipeValues.map((item, index) => (
       <div key={index} className="mealTimes">
                <h2>{item.title}</h2>
                <p>Serving: {item.servings}</p>
                <p>Ingredients: {item.ingredients}</p>
                <div className="right-aligned">
                  <button onClick={() => removeRecipe(item.title)}>Remove</button>
                <button className="search-bar-button" onClick={() => navigate(`/recipeDetail/${slugifyName(item.title)}`)}>View More</button>
                </div>
            </div>
      ))}

    </div>
  )

}

export default SavedRecipe;