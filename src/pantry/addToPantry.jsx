import React, { useState, useEffect } from 'react';
import { getPantries } from './getPantries';


/*
FEATURES:
- Add an item to the pantry
    - pantry
    - item name
    - quantity
    - unit of measurement
*/

function AddToPantry() {
    /* example request:
        HEADER:
        {"Content-Type": "application/json"}


        BODY:
        {
            "pantry_id": 1,
            "item_name": "Durian",
            "extra_info": "None",
            "quantity": 4,
            "unit": "units"
        }
    */

    let sendBody = {}
    let getUserID = parseInt(localStorage.getItem('user_id'));
    let user_id = (getUserID != null) ? getUserID : -1; //placeholder in case user_id doesn't work.


    
    
    
    let getPantriesForId = getPantries(user_id);
    console.log('RECIEVED DATA')
    console.log(getPantriesForId)
    console.log(typeof getPantriesForId)
    let [pantries, setPantries] = useState([]);




    let [pantry, setPantry] = useState('Select a Pantry')

    let handlePantryChange = (e) => {
        setPantry(e.target.value)
    }


    const sendPostAddItemToPantry = async () => {
        let json = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendBody)
        }
        // console.log(json)
        return await fetch('http://localhost:3001/postAddItemToPantry', json)
    }


    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);



        sendBody.item_name = formData.get('item_name');
        sendBody.extra_info = formData.get('extra_info');
        sendBody.quantity = formData.get('quantity');
        sendBody.unit = formData.get('unit');
        sendBody.pantry_id = parseInt(pantry)
        console.log('Submitted')
        sendPostAddItemToPantry()

    }

    async function updatePantries() {
        await getPantriesForId.then((recievedPantries) => {
            // console.log("Updated Pantries")
            // console.log(recievedPantries)
            setPantries(recievedPantries)
            // console.log(pantries)
        })

    }


    useEffect(() => {
        updatePantries();
        // console.log(pantries)
    }, [pantry])

    // console.log("CHECKING PANTRIES")
    // console.log(pantries)
    return (
        <div className="AddToPantry">
            <div class="section">
                <h1>Add an Item</h1>



                <div class="genericContentBox">


                    <form method="post" onSubmit={handleSubmit}>
                        <label for="pantries">Choose a pantry: </label>
                        <select onChange={handlePantryChange} name="pantries" id="pantries">
                            <option value="&noPantry">-- Select a Pantry --</option>

                            {pantries.map((entry) => (

                                <option key={entry.pantry_id} value={entry.pantry_id}>{entry.pantry_name}</option>
                            ))}
                        </select>
                        <br></br>


                        <label for="item_name">Item Name: </label>
                        <input type="text" name="item_name"></input>
                        <br></br>


                        <label for="extra_info">Extra Information: </label>
                        <input type="text" name="extra_info"></input>
                        <br></br>
                        <br></br>


                        <label for="quantity">Quantity: </label>
                        <input type="text" name="quantity"></input>
                        <br></br>


                        <label for="unit">Units: </label>
                        <select name="unit" id="unit">
                            <option value="units">Units</option>
                            <option value="milligrams">Milligrams</option>
                            <option value="grams">Grams</option>
                            <option value="kilograms">Kilograms</option>
                            <option value="millilitres">Millilitres</option>
                            <option value="litres">Litres</option>
                            <option value="kilolitres">Kilolitres</option>
                            <option value="cups">Cups</option>
                            <option value="tsps">Teaspoons</option>
                            <option value="tbsps">Tablespoons</option>
                        </select>
                        <br></br>
                        <br></br>

                        {/* <input type="submit" name="submit" value="Save"></input> */}
                        <input type="submit" name="submit" value="Add Item"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default AddToPantry;