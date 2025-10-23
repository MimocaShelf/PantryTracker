import React, { useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import { getPantries, getPantryItem} from './getPantries';


/*
FEATURES:
- Edit pantry item fields
*/

function EditPantryItem() {
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
    let navigate = useNavigate();
    let getUserID = parseInt(localStorage.getItem('user_id'));
    let user_id = (getUserID != null) ? getUserID : 1; //placeholder in case user_id doesn't work.
    let getPantryItemID = localStorage.getItem('pantry_item_id');
    let pantry_item_id = (getPantryItemID != null) ? parseInt(getPantryItemID) : 1;
    let getPantryID = localStorage.getItem('pantry_id');
    let pantry_id = (getPantryID != null) ? parseInt(getPantryID) : 1;


    
    
    
    let getPantriesForId = getPantries(user_id);
    let getPantryItemFromPantryID = getPantryItem(pantry_item_id);
    console.log('RECIEVED DATA')
    let [pantries, setPantries] = useState([]);
    let [pantryItem, setPantryItem] = useState({});




    let [pantry, setPantry] = useState(pantry_id)

    let handlePantryChange = (e) => {
        setPantry(e.target.value)
    }


    const sendPostEditItemInPantry = async () => {
        let json = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendBody)
        }
        // console.log(json)
        return await fetch('http://localhost:3001/postEditPantryItemFromPantryItemID', json)
    }


    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);


        sendBody.pantry_item_id = pantry_item_id;
        sendBody.item_name = formData.get('item_name');
        sendBody.extra_info = formData.get('extra_info');
        sendBody.quantity = formData.get('quantity');
        sendBody.unit = formData.get('unit');
        sendBody.pantry_id = parseInt(pantry)
        console.log('Submitted')
        sendPostEditItemInPantry()
        localStorage.setItem('pantry', pantry)
        navigate('/pantryview')
        
    }

    async function updatePantries() {
        await getPantriesForId.then((recievedPantries) => {
            // console.log("Updated Pantries")
            // console.log(recievedPantries)
            setPantries(recievedPantries)
            // console.log(pantries)
        })
    }
    async function updatePantryItem() {
        await getPantryItemFromPantryID.then((data) => {
            setPantryItem(data)
        })
    }


    useEffect(() => {
        updatePantries();
        // console.log(pantries)
    }, [pantry])
    useEffect(() => {
        updatePantryItem();
    }, []) 

    // console.log("CHECKING PANTRIES")
    // console.log(pantries)
    return (
        <div className="AddToPantry">
            <div class="section">
                <h1>Add an Item</h1>



                <div class="genericContentBox">

                    <form method="post" onSubmit={handleSubmit}>
                        <label for="pantries">Choose a pantry: </label>
                        <select onChange={handlePantryChange} name="pantries" id="pantries" defaultValue={pantryItem.pantry_id}>
                            {/* <option value="&noPantry">-- Select a Pantry --</option> */}

                            {pantries.map((entry) => (

                                <option key={entry.pantry_id} value={entry.pantry_id}>{entry.pantry_name}</option>
                            ))}
                        </select>
                        <br></br>


                        <label for="item_name">Item Name: </label>
                        <input type="text" name="item_name" defaultValue={pantryItem.item_name}></input>
                        <br></br>


                        <label for="extra_info">Extra Information: </label>
                        <input type="text" name="extra_info" defaultValue={pantryItem.extra_info}></input>
                        <br></br>
                        <br></br>


                        <label for="quantity">Quantity: </label>
                        <input type="text" name="quantity" defaultValue={pantryItem.quantity}></input>
                        <br></br>


                        <label for="unit">Units: </label>
                        <select name="unit" id="unit" defaultValue={pantryItem.unit}>
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
                        <input type="submit" name="submit" value="Edit Item"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default EditPantryItem;