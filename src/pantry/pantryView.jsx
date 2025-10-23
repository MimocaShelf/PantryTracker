import { render } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router';
import { getPantryItems, getPantryName, postDeletePantryItem } from './getPantries';

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
    let navigate = useNavigate();




    let getPantryItemsFromPantryID = getPantryItems(pantry_id);
    let getPantryNameFromPantryID = getPantryName(pantry_id);

    let [pantryName, setPantryName] = useState('null');
    let [pantryItems, setPantryItems] = useState([]);
    let [refresh, setRefresh] = useState(false)

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

    function updateRefresh() {
        setRefresh(false);
    }



    useEffect(() => {
        updatePantryName();
        updateRefresh();
    }, [refresh])
    useEffect(() => {
        updatePantryItems();
        updateRefresh();
    }, [refresh])


    function renderPantryCards() {
        return pantryItems.map((entry) => (
            <div class="pantryCard">
                <h2>{entry.item_name}</h2>
                <p>Extra Information: {entry.extra_info}</p>
                <p>Amount: {entry.quantity} {entry.unit}</p>
                <button type="button" onClick={() => {
                    try {
                        postDeletePantryItem(entry.pantry_item_id)
                        setRefresh(true);
                    } catch (err) { console.log(err) }
                }}>Delete</button>
                <button type="button" onClick={() => {
                    localStorage.setItem('pantry_item_id', entry.pantry_item_id)
                    navigate('/editpantryitem')
                }}>Edit</button>
            </div>
        ))
    }



    return (
        <div class="section">
            <h1>View of {pantryName}</h1>
            <div>
                <button>Filters</button>
                <button>Order By</button>
                <a href="addtopantry"><button type="button">Add Item</button></a>
                <input id="search-bar" placeholder='Search...' type="text" />
            </div>
            <br></br>
            <div class="pantryCards">
                {renderPantryCards()}
            </div>
        </div>
    );
}
export default PantryView;