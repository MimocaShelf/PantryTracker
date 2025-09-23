import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';



function NutritionLogic() {
  //const [data, setData] = useState([]);
  //const [message, setMessage] = useState(null);
  const [nutritionValues, setNutritionValues] = useState([]);
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState({});

  function submitUserFilter() {
    const userInput = document.getElementById('search-bar').value;

    fetch('http://localhost:3001/submitUserInput', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({input: userInput})
      })
        .then(res => res.json())
        .then(data => {
          console.log('Response from backend:', data);
          setNutritionValues(data)
        })
        .catch(err => console.error('Error sending data: ', err))
  }

  function handleTimeChange(index, value) {
    setSelectedTime(prev => ({ ...prev, [index]: value}))
  }

  function addItemToMealPrep(item, time) {
      console.log(item, time)

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
          console.log('Response from backend:', data);
        })
        .catch(err => console.error('Error sending data: ', err))
  }

  useEffect(() => {
    fetch('http://localhost:3001/getAllItemsAndNutritionValues')
    .then(res => res.json())
    .then(data => {
      console.log('Nutrition Data:', data);
      setNutritionValues(data)
    })
    .catch(err => console.error('Error: ', err))
  }, [])

  return (
    <div>
            <div class="section">
            <h1>Nutrition Page</h1>
            <p>See the list of pantry items you have and their nutritional values.</p>
            <p>Add ingredients certain items to your meal plan to help generate recipes for breakfast, lunch and dinner</p>
            </div>
            <div class='input-field'>
                <input id="search-bar" placeholder='Search...' type="text"/>
                <button onClick={submitUserFilter}>Submit</button>
                <button>Ingredient List</button>
                <button onClick={() => navigate('/mealPrep')}>Weekly Meal Plan</button>
            </div>
            {nutritionValues.map((item, index) => (
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
                <select name="times" value={selectedTime[index] || 'Breakfast'} onChange={(e) => handleTimeChange(index, e.target.value)}>
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                </select>
                </div>
                
            </div>
            ))}
            
        </div>
  )

  /*
  useEffect(() => {
    fetch('https://api.calorieninjas.com/v1/nutrition?query=tomato',{
        headers: new Headers({
        'X-Api-Key': 'Xz2dnc55NIazsDTB8LwepQ==skey8YnBDsAfCttn'
        })
    })
      .then(response => {
        return response.json();
        })
      .then(json => {
        console.log(json)
        setData(json)})
      .catch(error => console.log(error));
  }, []);

  
  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
    </div>
  );

  useEffect(() => {
    fetch('http://localhost:3001/getAllItems')
    .then(response => response.json())
    .then(data => {
      setMessage(data)
      console.log(data)
    })
    .catch(error => console.error(error))
  }, [])


  useEffect(() => {
    if(message && Array.isArray(message))
      message.forEach(item => {
        const itemName = item.item_name;
        console.log('pass')
     
    fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(itemName)}`,{
        headers: new Headers({
        //add api key
        })
    })
      .then(response => {
        return response.json();
        })
      .then(json => {
        console.log('Nutrition: ', json)
        setData(json)})
      .catch(error => console.log(error));
     });
  }, [message]);
/*
  return (
    <div>
      {message ? <p>{message}</p> : <p>loading</p>}
    </div>
  )*/
//'X-Api-Key': 'Xz2dnc55NIazsDTB8LwepQ==skey8YnBDsAfCttn'*/
}

export default NutritionLogic;