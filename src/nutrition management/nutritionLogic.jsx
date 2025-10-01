import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function NutritionLogic() {
  const navigate = useNavigate();
  const [nutritionValues, setNutritionValues] = useState([]);
  const [selectedTime, setSelectedTime] = useState({});
  const [sortBy, setSortBy] = useState('calories');
  const [orderBy, setOrderBy] = useState('ascending');

  //Function that acquires all the nutrition values for each pantry item 
  function getNutritionValues() {

    //Calls the backend server to get all pantry items in the database and acquire the nutrition values by passing it to the Nutrition API
    fetch('http://localhost:3001/getAllItemsAndNutritionValues')
    .then(res => res.json())
    .then(data => {
      setNutritionValues(data) //Update the state with the fetched list of pantry item object
    })
    .catch(err => console.error('Error: ', err))
  }

  //Function that fetches the pantry items and nutrition values based on the keyword the user inputted in the search bar
  function submitUserFilter() {
    const userInput = document.getElementById('search-bar').value; //Acquires the keyword from search bar and store in a variable

    //Calls the backend server to acquire all pantry items with the name corresponding to the keyword and its nutrition values
    fetch('http://localhost:3001/submitUserInput', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({input: userInput})
    })
    
    .then(res => res.json())
    .then(data => {
      setNutritionValues(data) //Update the state with the fetched list of pantry item
    })
    .catch(err => console.error('Error sending data: ', err))
  }

  //Function that updates the state with the new selected meal time 
  function handleTimeChange(index, value) {
    setSelectedTime(prev => ({ ...prev, [index]: value}))
  }

  //Function that adds a new record to the meal plan table with the item name and time
  function addItemToMealPrep(item, time) {

    //Calls the backend server to add a new record to the meal plan table 
    fetch('http://localhost:3001/addToMealPrep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemName: item.itemName,
        time: time
      })
    })

    .then(res => res.json())
    .then(data => {

      //If backend server response as success is failed, it indicates a record exist for that specific item and meal time
      if(!data.success) {
        alert("This item is already set for " + time) //Triggers a JavaScript alert indicating item has been set for that meal time
      }
    })
    .catch(err => console.error('Error sending data: ', err))
  }

  //Function that sorts the list of pantry items based on order and nutrition value
  function sortIngredientOrder(sortBy, orderBy) {
    const sortedList = [...nutritionValues].sort((a, b) => {
      if(orderBy === 'ascending'){
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy];
      }
    });

    setNutritionValues(sortedList); //Update the state with the new reordered and sorted list of pantry items
  }

  //Function that renders list of pantry items and its nutrition values
  function renderNutritionValue() {

    //If the list of pantry items stores in the nutritionValue state is empty
    if(nutritionValues.length === 0){
      return <p>No nutrition data available</p>
    }

    //Else return the formatted list of pantry items
    //Goes through each item in the list of pantry items
    return nutritionValues.map((item, index) => (
      <div key={index} class="nutritionBox">
        <div class="row">
          <div class="left-container">
              <h2>{item.itemName}</h2>
          </div>
          <div class="right-container">
            <h3>Calories: {item.calories}</h3>
            <h3 id="purple-text">Protein: {item.protein}</h3>
            <h3 id="pink-text">Carbs: {item.carbohydrate}</h3>
            <h3 id="lavender-text">Fats: {item.fats}</h3>
          </div>
        </div>
        <div class="right-aligned">
          <button onClick={() => addItemToMealPrep(item, selectedTime[index] || 'Breakfast')}>Add To Meal Prep</button>
          <select class="selector" name="times" value={selectedTime[index] || 'Breakfast'} onChange={(e) => handleTimeChange(index, e.target.value)}>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
          </select>
        </div>
      </div>
    ));
  }

  //Sends a request to the backend server to retrieve all the pantry items and its nutrition data
  useEffect(() => {
    fetch('http://localhost:3001/getAllItemsAndNutritionValues')
    .then(res => res.json())
    .then(data => {
      console.log('Nutrition Data:', data);
      setNutritionValues(data) //Update the state with the acquired list of pantry items with nutrition data from the response
    })
    .catch(err => console.error('Error: ', err))
  }, [])

  //Calls the sortIngredientOrder function whenever changes are detected with the sortBy or orderBy selectors 
  useEffect(() => { 
    //Sorts the pantry item list based on the inputed sortBy and orderBy selector
    sortIngredientOrder(sortBy, orderBy)
  }, [sortBy, orderBy])

  return (
    <div class="nutritionContainer">

      <div class="section">
        <h1>Nutrition Page</h1>
        <p>See the list of pantry items you have and their nutritional values.</p>
        <p>Add ingredients certain items to your meal plan to help generate recipes for breakfast, lunch and dinner</p>
      </div>

      <div class='nutrition-input-field'>
        <input id="search-bar" placeholder='Search...' type="text"/>
        <button class="search-bar-button" onClick={submitUserFilter}>Submit</button>
        <button class="search-bar-button" onClick={getNutritionValues}>Reset</button>
        <button onClick={() => navigate('/mealPrep')}>Weekly Meal Plan</button>   
      </div>

      <div class='input-field'>
        <select class="selector" name="sortBy" onClick={(e) => setSortBy(e.target.value)}>
          <option value="calories">Calories</option>
          <option value="protein">Protein</option>
          <option value="carbohydrate">Carbs</option>
          <option value="fats">Fats</option>
        </select>
        <select class="selector" name="orderBy" onClick={(e) => setOrderBy(e.target.value)}>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>

      {renderNutritionValue()}
    </div>
  )

}

export default NutritionLogic;