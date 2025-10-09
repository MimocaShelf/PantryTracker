import { render } from '@testing-library/react';
import React, {useState, useEffect} from 'react';
/*
FEATURES:
- View all items in given pantry
*/

function PantryView() {
    let pantry_id = 1
    let [pantryName, setPantryName] = useState('');
    function getPantryNameFromPantryID (pantry_id) {
        let json = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"pantry_id": pantry_id})
        }
        fetch('http://localhost:3001/postGetPantryNameFromPantry', json)
        .then(res => {res.json()})
        .then(data => {
            setPantryName(data)
        })
        .catch(err => console.error('Error: ', err))
    }
    pantryName = getPantryNameFromPantryID(pantry_id).then()
    

    async function getPantryItemsFromPantryID() {

    }
    
    useEffect(() => {
        localStorage.setItem('pantryName', pantryName)
        setPantryName()
    }, pantryName)
    


    function renderPantryCards() {
        return (
            <div class="pantryCard">
                    <h2>Apple</h2>
                    <p>Extra Information: Lorem Ipsum Dolor Sit Amet</p>
                    <p>Amount: 4 Units</p> 
            </div>
        )
    }



    return (
        <div class="section"> 
            <h1>View of Pantry {pantryName}</h1>
            <div>
                <button>Filters</button> 
                <button>Order By</button>
                <input id="search-bar" placeholder='Search...' type="text"/>
            </div>
            <div class="pantryCards">
                {renderPantryCards()}
            </div>
        </div>
    );
}
export default PantryView;