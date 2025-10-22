import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetail() {
    const navigate = useNavigate();
    const { name } = useParams();
    const [recipeDetail, setRecipeDetail] = useState([]);
    const [addToShoppingList, setAddedToShoppingList] = useState(null);
    const handleGoBack = () => {navigate(-1)}

    //Function to un-slugify the recipe name in preperation of passing the name to the backend server, specifically the external API
    function unslugifyName(recipe){
        return recipe.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    //Function that calls the Backend API to save the each ingredients from the recipe as a seperate record within the shopping list table
    function addShoppingList(ingredient){
        //Request the backend server to add the list of ingredients to the shopping list table as each seperate record
        fetch('http://localhost:3001/addToShoppingList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredients: ingredient //Passes the ingredient list
            })
        })
        .then(res => res.json())
        .then(data => {
            setAddedToShoppingList(data); //Adds the recipe into list to ensure successful reponse prompt is triggered when rendering item
            setTimeout(() => setAddedToShoppingList(null), 2000); //Ensure success message appears and disappears
        })
        .catch(err => console.error('Error sending data: ', err))
    }

    //Calls the Backend Server API to get the serving size, ingredient list and instructions through passing the name and acquring the information through an external API
    useEffect(() => {
        fetch('http://localhost:3001/getSpecificRecipe', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipe: unslugifyName(name) //Unslugify the recipe name to ensure an exact match is found from the external API
            })
        })
        .then(res => res.json())
        .then(data => {
            setRecipeDetail(data); //Set the response which would contain the recipe and its detail into the recipeDetail state
        })
        .catch(err => console.error('Error: ', err))
    }, [])

    //Renders the ingredient list as an unordered list
    function IngredientList({ ingredient }) {
        //Split the ingredients string through splitting the string when there is a '|' character and removing categories such as 'Dough:' by removing words that ends with a ':'
        const items = ingredient.split('|').map(item => item.trim()).filter(item => item && !/^.+?:/.test(item));
        return (
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        )
    }

    //Renders the instruction list as an ordered list
    function InstructionList({ instruction }) {
        //Split the instruction string through splitting the string when there is a '.' and removing an words the indicate each step such as '1.' to prevent overlap
        const items = instruction.split('.').map(item => item.trim().replace(/^\d+\s*\.*\s*/, '')).filter(Boolean);
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
                    <div class="recipe-detail-section">
                        <h1>{recipeDetail[0].title}</h1>
                        <h2>Serving: {recipeDetail[0].servings}</h2>
                    </div>
                    <div class="recipe-detail-section">
                        <h2>Ingredients</h2>
                        <IngredientList ingredient={recipeDetail[0].ingredients} />
                        <button onClick={() => addShoppingList(recipeDetail[0].ingredients)}>Add To Shopping List</button>
                        {addToShoppingList && (
                            <p>Ingredients been successfully added to shopping list</p>
                        )}
                    </div>
                    <div class="recipe-detail-section">
                        <h2>Instructions</h2>
                        <InstructionList instruction={recipeDetail[0].instructions}/>
                    </div>
                    <button onClick={handleGoBack}>Go Back</button>  
                    
                </div>
            ):(
                <p>Loading</p>
            )}
        </div>
    
    )

}

export default RecipeDetail;