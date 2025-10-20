import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Recipe() {
  const navigate = useNavigate();
  const [recipeValues, setRecipeValues] = useState([]);
  const [allRecipes, setAllRecipeValues] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [orderBy, setOrderBy] = useState('ascending');

  function submitUserFilter() {
    const userInput = document.getElementById('search-bar').value; //Acquires the keyword from search bar and store in a variable

    const filtered = allRecipes.filter(recipe => recipe.title.toLowerCase().includes(userInput.toLowerCase()))

    setRecipeValues(filtered);
    
  }

  function getRecipeValues() {
    fetch('http://localhost:3001/getRecipeForEachItem')
      .then(res => res.json())
      .then(data => {
        console.log('Nutrition Data:', data);
        setRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
        setAllRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
      })
      .catch(err => console.error('Error: ', err))
  }

  function extractNumber(serving){
    const match = serving.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  //Function that sorts the list of pantry items based on order and nutrition value
  function sortRecipeOrder(sortBy, orderBy) {
    const sortedRecipe = [... recipeValues].sort((a, b) => {
      let valA = sortBy === 'serving'
      ? extractNumber(a.servings) || 0
      : a.title.toLowerCase();

      let valB = sortBy === 'serving'
      ? extractNumber(b.servings) || 0
      : b.title.toLowerCase();

      if (valA < valB) return orderBy === 'ascending' ? -1 : 1; 
      if (valA > valB) return orderBy === 'ascending' ? 1 : -1; 
      return 0;
    })

    setRecipeValues(sortedRecipe); //Update the state with the new reordered and sorted list of pantry items
  }

  //Function that adds a new record to the meal plan table with the item name and time
  function addToSavedItems(recipe) {

    //Calls the backend server to add a new record to the meal plan table 
    fetch('http://localhost:3001/addToSavedRecipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipe: recipe,
      })
    })

    .then(res => res.json())
    .then(data => {

      //If backend server response as success is failed, it indicates a record exist for that specific item and meal time
      if(!data.success) {
        alert("This item is already in saved recipe ") //Triggers a JavaScript alert indicating item has been set for that meal time
      }
    })
    .catch(err => console.error('Error sending data: ', err))
  }

  useEffect(() => {
      fetch('http://localhost:3001/getRecipeForEachItem')
      .then(res => res.json())
      .then(data => {
        console.log('Nutrition Data:', data);
        setRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
        setAllRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
      })
      .catch(err => console.error('Error: ', err))
    }, [])

    //Calls the sortIngredientOrder function whenever changes are detected with the sortBy or orderBy selectors 
      useEffect(() => { 
        //Sorts the pantry item list based on the inputed sortBy and orderBy selector
        sortRecipeOrder(sortBy, orderBy)
      }, [sortBy, orderBy])

  return (
    <div class="nutritionContainer">

      <div class="section">
        <h1>Recipe Page</h1>
        <p>See your list of recommended recipes based on items that is in your pantry.</p>
        <p>Click on 'view more' to see more information about the recipe including instructions and list of additional ingredients needed to complete the meal</p>
      </div>

       <div class='nutrition-input-field'>
        <input id="search-bar" placeholder='Search...' type="text"/>
        <button class="search-bar-button" onClick={submitUserFilter}>Submit</button>
        <button class="search-bar-button" onClick={getRecipeValues}>Reset</button>
        <button onClick={() => navigate('/savedRecipe')}>Saved Recipes</button>   
      </div>

      <div class='input-field'>
        <select class="selector" name="sortBy" onClick={(e) => setSortBy(e.target.value)}>
          <option value="name">Name</option>
          <option value="serving">Serving</option>
        </select>
        <select class="selector" name="orderBy" onClick={(e) => setOrderBy(e.target.value)}>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>

      {recipeValues.map((item, index) => (
       <div key={index} className="mealTimes">
                <h2>{item.title}</h2>
                <p>Serving: {item.servings}</p>
                <p>Ingredients: {item.ingredients}</p>
                <div className="right-aligned">
                  <button onClick={() => addToSavedItems(item.title)}>Save Recipe</button>
                <button className="search-bar-button" onClick={() => alert('Feature not yet available...')}>Start Cooking</button>
                </div>
            </div>
      ))}



      

    </div>
  )

}

export default Recipe;