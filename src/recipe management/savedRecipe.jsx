import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function SavedRecipe() {
    const navigate = useNavigate();
    const [recipeValues, setRecipeValues] = useState([]);

    //Function that removes the record of the recipe
    function removeRecipe(recipe){
        //Request the backend server to remove the recipe record that corresponds to the recipe name
        fetch('http://localhost:3001/removeRecipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipe: recipe //sends the recipe name in the body's message
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.message)
            getSavedRecipe() //Updates the saved recipe list state to match the recipes in the database
        })
        .catch(err => console.error('Error sending data: ', err))
    }

    //Function that request the backend database to get all the recipes saved in the database and acquire the serving size and ingredient list by calling an external API
    function getSavedRecipe() {
        fetch('http://localhost:3001/getSavedRecipe')
        .then(res => res.json())
        .then(data => {
            setRecipeValues(data) //Update the state with the list of saved recipes received from the response
        })
      .catch(err => console.error('Error: ', err))
    }

    //Function to slugify the recipe name in preperation of access the recipe details page
    function slugifyName(recipe) {
        return recipe.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-']/g, '')
    }

    //Gets the list of saved recipes that contains one ingredient within the user's pantry
    useEffect(() => {
        fetch('http://localhost:3001/getSavedRecipe')
        .then(res => res.json())
        .then(data => {
            setRecipeValues(data) //Update the state with the list of saved recipes received from the response
        })
        .catch(err => console.error('Error: ', err))
    }, [])

    //Function that renders list of saved recipes
    function renderSavedRecipes() {
        //If the list of saved recipes stores in the recipeValues state is empty
        if(recipeValues.length === 0){
            return <p>No saved recipes</p>
        }

        //Else return the formatted list of savedrecipe
        //Goes through each item in the list of saved recipe
        return recipeValues.map((item, index) => (
            <div key={index} className="mealTimes">
                <h2>{item.title}</h2>
                <p><b>Serving:</b> {item.servings}</p>
                <p><b>Ingredients:</b> {item.ingredients}</p>
                <div className="right-aligned">
                    <button onClick={() => removeRecipe(item.title)}>Remove</button>
                    <button className="search-bar-button" onClick={() => navigate(`/recipeDetail/${slugifyName(item.title)}`)}>View More</button>
                </div>
            </div>
        ))
    }

    return (
        <div class="nutritionContainer">
            <div class="section">
                <h1>Saved Recipe</h1>
                <p>View all the recipes you have saved.</p>
                <p>Click on 'View More' to see more information about the recipe including instructions and list of additional ingredients needed to complete the meal</p>
                <button onClick={() => navigate('/recipe')}>All Recipes</button>  
            </div>

            {renderSavedRecipes()}

        </div>
    )

}

export default SavedRecipe;