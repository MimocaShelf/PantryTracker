import React from 'react';
/*
FEATURES:
- View all items in given pantry
*/

function PantryView(pantry_id) {
    return (
        <div class="section">
            <h1>View of Pantry </h1>
            <div>
                <button>Filters</button>
                <button>Order By</button>
                <input id="search-bar" placeholder='Search...' type="text"/>
            </div>
            <div class="pantryCards">
                <div class="pantryCard">
                    <h2>Apple</h2>
                    <p>Extra Information: Lorem Ipsum Dolor Sit Amet</p>
                    <p>Amount: 4 Units</p>
                </div>
                <div class="pantryCard">
                    <h2>Flour</h2>
                    <p>Extra Information: Lorem Ipsum Dolor Sit Amet</p>
                    <p>Amount: 2.5 Kilograms</p>
                </div>
                <div class="pantryCard">
                    <h2>Milk</h2>
                    <p>Extra Information: Lorem Ipsum Dolor Sit Amet</p>
                    <p>Amount: 1 Litre</p>
                </div>
            </div>
        </div>
    );
}
export default PantryView;