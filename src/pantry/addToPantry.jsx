import React, {useState} from 'react';
// import addItemToPantry from '../../server/addToPantryLogic.jsx';

/*
FEATURES:
- Add an item to the pantry
    - pantry
    - item name
    - quantity
    - unit of measurement
*/

function AddToPantry() {

    const getPantries = () => {}


    let pantries = [
        {value: 'main_pantry', text: 'Main Pantry'},
        {value: 'fridge', text: 'Fridge'},
        {value: 'sink', text: 'Sink'},
    ]
    let [pantry, setPantry] = useState('Select a Pantry')

    let handlePantryChange = (e) => {
        setPantry(e.target.value)
    }

    

    return (
        <div className="AddToPantry">
            <div class="section">
                <h1>Add an Item</h1>
                {pantry}
                




                <div class="genericContentBox">

                    <label for="pantries">Choose a pantry: </label>
                    <select onChange={handlePantryChange} name="pantries" id="pantries">
                        <option value="Select a Pantry">-- Select a Pantry --</option>
                        
                        {pantries.map((entry) => (
                            <option value={entry.value}>{entry.text}</option>
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

                    <input type="submit" name="submit" value="Save"></input>
                    <input type="submit" name="submit" value="Add Item"></input>
                </div>
            </div>
        </div>
    );
}
export default AddToPantry;