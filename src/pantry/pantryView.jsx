import { render } from '@testing-library/react';
import React, {useState, useEffect} from 'react';
import { getPantryItems, getPantryName } from './getPantries';

/*
FEATURES:
- View all items in given pantry

HOW TO USE:
1. Set pantry_id in localStorage
2. Redirect to this page



*/

function PantryView() {
    let getPantryID = localStorage.getItem('pantry_id');
    let pantry_id = (getPantryID != null) ? parseInt(getPantryID) : 1;


    
    
    let getPantryItemsFromPantryID = getPantryItems(pantry_id);
    let getPantryNameFromPantryID = getPantryName(pantry_id);

    let [pantryName, setPantryName] = useState('null');
    let [pantryItems, setPantryItems] = useState([]);
    
     async function updatePantryName() {
        await getPantryNameFromPantryID.then((data) => {
            // console.log("Updated Pantries")
            setPantryName(data.pantry_name)
            // console.log(data)
        })
    }
     async function updatePantryItems() {
        await getPantryItemsFromPantryID.then((data) => {
            // console.log("Updated Pantries")
            setPantryItems(data)
            // console.log(data)
        })
    }
    

    


    useEffect(() => {
            updatePantryName();
        }, [pantryName])
    useEffect(() => {
            updatePantryItems();
        }, [pantryName])


    function renderPantryCards() {
        return pantryItems.map((entry) => {
        (
            <div class="pantryCard">
                    <h2>Apple </h2>
                    <p>Extra Information: Lorem Ipsum Dolor Sit Amet</p>
                    <p>Amount: 4 Units</p> 
            </div>
        )
        })
    }



    return (
        <div class="section"> 
            <h1>View of {pantryName}</h1>
            <div>
                <button>Filters</button> 
                <button>Order By</button>
                <input id="search-bar" placeholder='Search...' type="text"/>
            </div>
            <br></br>
            <div class="pantryCards">
                {pantryItems.map((entry) => (
                    <div class="pantryCard">
                            <h2>{entry.item_name}</h2>
                            <p>Extra Information: {entry.extra_info}</p>
                            <p>Amount: {entry.quantity} {entry.units}</p> 
                    </div>
                ))}
            </div>
        </div>
    );
}
export default PantryView;