import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetail() {
  const navigate = useNavigate();
  const { name } = useParams();
  const [recipeDetail, setRecipeDetail] = useState([]);
    const handleGoBack = () => {navigate(-1)}

    function unslugifyName(recipe){
        return recipe.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    function addShoppingList(ingredient){

        console.log(ingredient);

        //Request the backend server to remove the meal record that corresponds to the item name and meal time from the database
        fetch('http://localhost:3001/addToShoppingList', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredients: ingredient
            })
        })
        .then(res => res.json())
        .then(data => {
        })
        .catch(err => console.error('Error sending data: ', err))
        
    }

    useEffect(() => {
          fetch('http://localhost:3001/getSpecificRecipe', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipe: unslugifyName(name)
            })
          })
          .then(res => res.json())
          .then(data => {
            console.log('Nutrition Data:', data);
            setRecipeDetail(data);
          })
          .catch(err => console.error('Error: ', err))
        }, [])

function IngredientList({ ingredient }) {
    const items = ingredient.split('|').map(item => item.trim()).filter(Boolean);

    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    )

}

function InstructionList({ instruction }) {
    const items = instruction.split('.').map(item => item.trim()).filter(Boolean);

    return (
        <ol>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ol>
    )

}



    return (
    <div class="recipeDetails">

        {recipeDetail && recipeDetail.length > 0 ? (
       <div>
                <h1>{recipeDetail[0].title}</h1>
                <h2>Serving: {recipeDetail[0].servings}</h2>
                <h2>Ingredients</h2>
                <IngredientList ingredient={recipeDetail[0].ingredients} />
                 <button onClick={() => addShoppingList(recipeDetail[0].ingredients)}>Add</button>
                <h2>Instructions</h2>
                <InstructionList instruction={recipeDetail[0].instructions}/>
                <button onClick={handleGoBack}>Go Back</button>  
        </div>
        ):(
            <p>Loading</p>
        )}
    </div>
    
  )

}

export default RecipeDetail;