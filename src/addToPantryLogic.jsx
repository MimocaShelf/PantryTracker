import React from 'react';
// import maindb from './sql/app.js'
/*
    take input from addToPantry:
        - pantry (pantry_name)
        - item_name
        - extra_info
        - quantity
        - unit (of measurement)
    add to database
*/

function addItemToPantry(pantry, item_name, extra_info, quantity, unit) {
    let pantry_id;

    //convert pantry to pantry_id
//PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER 
    /*
        this will need to be linked to the database and users eventually, (also depends on how users and stuff get implemented)
        so i'm putting in a placeholder converter for now. 
    */
    switch(pantry) {
        case "main_pantry":
            pantry_id = 1;
        case "fridge":
            pantry_id = 4;
        case "sink":
            pantry_id = 2;        
        default:
            pantry_id = -1;
    }
//PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER 






    let sql_string = 'INSERT INTO pantry_items(pantry_id, item_name, extra_info, quantity, unit) VALUES (?, ?, ?, ?, ?)';
     // need to import sql database or something?

    let addToDatabase = () => {
        maindb.run(sql_string, [pantry_id, item_name, extra_info, quantity, unit], (err) => {
            if (err) return console.error(err.message);
        })
    }

    try {
        addToDatabase();
    } catch (err) {
        console.error(err.message);
    }
}
export default addItemToPantry;