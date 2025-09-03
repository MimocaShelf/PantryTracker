/*
    Add SQL strings to the array, and it will run them in order

*/

import maindb from "./app.js";

const sql_array = [
    //DROP TABLES
    'DROP TABLE IF EXISTS pantry_items',
    'DROP TABLE IF EXISTS nutrition',

    //CREATE TABLES
    `CREATE TABLE pantry_items (
        pantry_id INTEGER PRIMARY KEY,
        item_name VARCHAR(100),
        quantity DECIMAL(20, 5),
        unit VARCHAR(50)
    )`,

    `CREATE TABLE IF NOT EXISTS nutrition(nutrition_id INTEGER PRIMARY KEY, pantry_id INTEGER, calories , protein , carbs , fats , FOREIGN KEY(pantry_id) REFERENCES pantry_items(pantry_id))`,

    //INSERT DATA
    'INSERT INTO pantry_items VALUES (1, "Apple", 4, "units")',
    'INSERT INTO pantry_items VALUES (2, "Flour", 2.5, "kilograms")',
    'INSERT INTO pantry_items VALUES (3, "Milk", 1, "litre")',
    'INSERT INTO pantry_items VALUES (4, "Oats", 500, "grams")',
    'INSERT INTO pantry_items VALUES (5, "Yogurt", 170, "grams")',
    'INSERT INTO pantry_items VALUES (6, "Bananas", 5, "kilograms")',
    'INSERT INTO pantry_items VALUES (7, "Chicken Breast", 500, "grams")',
    'INSERT INTO pantry_items VALUES (8, "Rib Eye Steak", 200, "grams")',

    'INSERT INTO nutrition(pantry_id, calories, protein, carbs, fats) VALUES (3, 155, 8.5, 11.0, 8.5)',
    'INSERT INTO nutrition(pantry_id, calories, protein, carbs, fats) VALUES (4, 231, 6.2, 31.8, 1.4)',
    'INSERT INTO nutrition(pantry_id, calories, protein, carbs, fats) VALUES (5, 143, 12.2, 12.7, 9.9)',
    'INSERT INTO nutrition(pantry_id, calories, protein, carbs, fats) VALUES (6, 210, 1.4, 19.6, 1)',
    'INSERT INTO nutrition(pantry_id, calories, protein, carbs, fats) VALUES (7, 189, 31, 0, 3.6)',
    'INSERT INTO nutrition(pantry_id, calories, protein, carbs, fats) VALUES (8, 414, 24.3, 1, 35.2)',

    'SELECT * FROM nutrition JOIN pantry_items ON nutrition.pantry_id = pantry_items.pantry_id'

]

//For loop so it runs in order
maindb.serialize (() => {
    for (let i = 0; i < sql_array.length; i++) {
        if(sql_array[i].trim().split(/\s+/)[0] === 'SELECT'){
            maindb.all(sql_array[i], [], (err, row) => {
                if(err) return console.error(err.message);
                row.forEach(row => {
                    console.log(row);
                })
            });
        } else {
            let sql = sql_array[i];
            maindb.run(sql_array[i]);
        }
        
    }
});
