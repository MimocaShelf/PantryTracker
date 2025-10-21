import React, { useState, useEffect } from 'react';
import { getPantries } from './getPantries';


/*
FEATURES:
- Click on a pantry and view & edit information about it
    - Pantry Name 
    - Pantry Owner
    - Last Updated Pantry Item
    - Most used pantry item
    - Number of items in the pantry
    - Pie chart of pantry item updates

*/

function PantrySummary() {
    let getPantryID = localStorage.getItem('pantry_id');
    let pantry_id = (getPantryID != null) ? parseInt(getPantryID) : 1;


    return (
        <div className="PantrySummary">
            <div class="section">
                <h1>Pantry Summary</h1>



                <div class="genericContentBox">

                </div>
            </div>
        </div>
    );
}
export default PantrySummary;