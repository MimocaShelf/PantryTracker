import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Recipe() {
  const navigate = useNavigate();
  const [recipeValues, setRecipeValues] = useState([]); //contains all a list of recipe that is filtered based on user's search input or the filter controls
  const [allRecipes, setAllRecipeValues] = useState([]); //contains the list of all recipes based on each pantry item
  const [sortBy, setSortBy] = useState('name');
  const [orderBy, setOrderBy] = useState('ascending');
  const [savedRecipe, setSavedRecipe] = useState(null);

  function submitUserFilter() {
    const userInput = document.getElementById('search-bar').value; //Acquires the keyword from search bar and store in a variable
    const filtered = allRecipes.filter(recipe => recipe.title.toLowerCase().includes(userInput.toLowerCase())) //filters the list that contains all the recipes that has a recipe title that matches the user input
    setRecipeValues(filtered); //set the filtered list with the items in the filtered variable
  }

  //Function that fetches the recipe(s) based on the keyword the user inputted in the search bar
  function getRecipeValues() {
    fetch('http://localhost:3001/getRecipeForEachItem')
      .then(res => res.json())
      .then(data => {
        setRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
        setAllRecipeValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
      })
      .catch(err => console.error('Error: ', err))
  }

  //Function that extracts that attempts to find the first number and converts the statement from '4 serving' to '4'
  function extractNumber(serving){
    const match = serving.match(/\d+/); //Attempts to find the number
    return match ? parseInt(match[0]) : 0; //Changes the statement to simply presenting the number or 0 if there is no number found
  }

  //Function that sorts the list of recipe based on name or serving
  function sortRecipeOrder(sortBy, orderBy) {

    //Creates a copy of recipeValues and sorts the lists
    const sortedRecipe = [... recipeValues].sort((a, b) => {
      let valA = sortBy === 'serving' //Set the first recipe as either the serving number or its name but lowercase depending on whether user selected to sort in alphabetical order or serving size
      ? extractNumber(a.servings) || 0
      : a.title.toLowerCase();

      let valB = sortBy === 'serving' //Set the second recipe as either the serving number or its name but lowercase depending on whether user selected to sort in alphabetical order or serving size
      ? extractNumber(b.servings) || 0
      : b.title.toLowerCase();

      //Compare the values of the first and second recipe and alter their order depending on whether the user selected ascending or descending
      if (valA < valB) return orderBy === 'ascending' ? -1 : 1;
      if (valA > valB) return orderBy === 'ascending' ? 1 : -1; 
      return 0;
    })

    setRecipeValues(sortedRecipe); //Update the state with the new reordered and sorted list of pantry items
  }

  //Function that adds the recipe to their saved recipes
  function addToSavedItems(recipe) {

    //Calls the backend server to add the selected recipe to the user's saved recipe list on the table within the database
    fetch('http://localhost:3001/addToSavedRecipes', {
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

      //If backend server response as success is failed, it indicates a record exist for that specific recipe
      if(!data.success) {
        alert("This item is already in saved recipe ") //Triggers a JavaScript alert indicating the recipe is already within their saved recipe list
      } else {
        setSavedRecipe(recipe); //Adds the recipe into list to ensure successful reponse prompt is triggered when rendering item
        setTimeout(() => setSavedRecipe(null), 2000); //Ensure success message appears and disappears
      }
    })
    .catch(err => console.error('Error sending data: ', err))
  }

  //Function to slugify the recipe name in preperation of access the recipe details page
  function slugifyName(recipe) {
      return recipe.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-']/g, '') //Set the letters of the recipe name to lowercase and replaces spaces to '-'
  }

  //Gets the list of all recipes that contains one ingredient within the user's pantry
  useEffect(() => {
    fetch('http://localhost:3001/getRecipeForEachItem')
    .then(res => res.json())
    .then(data => {
      setRecipeValues(data) //Update the state with the list of recipes received from the response - this list will be altered and change depending on the filters the user's put
      setAllRecipeValues(data) //Update the state with the list of recipes received from the response
    })
    .catch(err => console.error('Error: ', err))
  }, [])

  //Calls the sortRecipeOrder function whenever changes are detected with the sortBy or orderBy selectors 
  useEffect(() => { 
    //Sorts the recipes based on the inputed sortBy and orderBy selector
    sortRecipeOrder(sortBy, orderBy)
  }, [sortBy, orderBy])

  //Function that renders list of recipes
  function renderRecipes() {
    //If the list of recipes stores in the recipeValues state is empty
    if(recipeValues.length === 0){
      return <p>No recipes found</p>
    }

    //Else return the formatted list of recipe
    //Goes through each item in the list of recipe
    return recipeValues.map((item, index) => (
      <div key={index} className="mealTimes">
        <h2>{item.title}</h2>
        <p><b>Serving:</b> {item.servings}</p>
        <p><b>Ingredients:</b> {item.ingredients}</p>
        <div className="right-aligned">
          <button onClick={() => addToSavedItems(item.title)}>Save Recipe</button>
          <button className="search-bar-button" onClick={() => navigate(`/recipeDetail/${slugifyName(item.title)}`)}>View More</button>
        </div>
        {savedRecipe === item.title && (
          <p class="successMessage">{item.title} has been successfully added to saved recipes</p>
        )}
      </div>
    ));
  }

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

      {renderRecipes()}

    </div>
  )

}

export default Recipe;