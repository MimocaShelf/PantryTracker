import React from 'react';
import addItemToPantry from './addToPantryLogic.jsx';
/*
FEATURES:
- Add an item to the pantry
    - pantry
    - item name
    - quantity
    - unit of measurement
*/
addItemToPantry()

function AddToPantry() {
    return (
        <div class="section">
            <h1>Add an Item</h1>
            <div class="genericContentBox">
                <form method="post">
                    <label for="pantries">Choose a pantry: </label>
                    <select name="pantries" id="pantries">
                        <option value="main_pantry">Main Pantry</option>
                        <option value="fridge">Fridge</option>
                        <option value="sink">Sink</option>
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
                </form>
            </div>
        </div>
    );
}
export default AddToPantry;