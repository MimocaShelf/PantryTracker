/*
    Add SQL strings to the array, and it will run them in order
*/

import maindb from "./app.js";

const sql_array = [
    //DROP TABLES
    'DROP TABLE IF EXISTS pantry_items',
    'DROP TABLE IF EXISTS nutrition',
    'DROP TABLE IF EXISTS pantry',
    'DROP TABLE IF EXISTS users',
    'DROP TABLE IF EXISTS households',
    'DROP TABLE IF EXISTS meal_slots',
    'DROP TABLE IF EXISTS meal_prep',
    'DROP TABLE IF EXISTS shopping_list',

    //CREATE TABLES
    `CREATE TABLE pantry_items (
        pantry_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        pantry_id INTEGER,
        item_name VARCHAR(100),
        extra_info VARCHAR(65535),
        quantity DECIMAL(20, 5),
        unit VARCHAR(50)
    )`,

    `CREATE TABLE IF NOT EXISTS nutrition(nutrition_id INTEGER PRIMARY KEY, pantry_item_id INTEGER, calories , protein , carbs , fats , FOREIGN KEY(pantry_item_id) REFERENCES pantry_items(pantry_item_id))`,

    `CREATE TABLE IF NOT EXISTS meal_slots(meal_slots_id INTEGER PRIMARY KEY AUTOINCREMENT, time)`,
    `CREATE TABLE IF NOT EXISTS meal_prep(
        meal_prep_id INTEGER PRIMARY KEY AUTOINCREMENT, 
        meal_slots_id INTEGER, 
        pantry_item_id INTEGER, 
        FOREIGN KEY(meal_slots_id) REFERENCES meal_slots(meal_slots_id), 
        FOREIGN KEY(pantry_item_id) REFERENCES pantry_items(pantry_item_id)
    )`,

    `CREATE TABLE pantry (
        pantry_id INTEGER PRIMARY KEY,
        pantry_ownder VARCHAR(100),
        pantry_name VARCHAR(100),
        pantry_itemAmount INTEGER
    )`,

     `CREATE TABLE users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        profile_picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE households (
        household_id INTEGER PRIMARY KEY AUTOINCREMENT,
        household_name VARCHAR(100) NOT NULL,
        created_by INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(created_by) REFERENCES users(user_id)
    )`,

    `CREATE TABLE IF NOT EXISTS shopping_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1
    )`,

    //INSERT ITEM DATA
    'INSERT INTO pantry_items(pantry_id, item_name, quantity, unit) VALUES (1, "Apple", 4, "units")',
    'INSERT INTO pantry_items(pantry_id, item_name, quantity, unit) VALUES (1, "Flour", 2.5, "kilograms")',
    'INSERT INTO pantry_items(pantry_id, item_name, quantity, unit) VALUES (1, "Milk", 1, "litres")',
    'INSERT INTO pantry_items(pantry_id, item_name, quantity, unit) VALUES (3, "Oats", 500, "grams")',
    'INSERT INTO pantry_items(pantry_id, item_name, quantity, unit) VALUES (3, "Yogurt", 170, "grams")',
    'INSERT INTO pantry_items(pantry_id, item_name, quantity, unit) VALUES (2, "Bananas", 5, "kilograms")',
    'INSERT INTO pantry_items(pantry_id, item_name, quantity, unit) VALUES (2, "Chicken Breast", 500, "grams")',
    'INSERT INTO pantry_items(pantry_id, item_name, quantity, unit) VALUES (2, "Rib Eye Steak", 200, "grams")',
    'INSERT INTO pantry_items(pantry_id, item_name, quantity, unit) VALUES (1, "Carrots", 5, "grams")',

    'INSERT INTO nutrition(pantry_item_id, calories, protein, carbs, fats) VALUES (3, 155, 8.5, 11.0, 8.5)',
    'INSERT INTO nutrition(pantry_item_id, calories, protein, carbs, fats) VALUES (4, 231, 6.2, 31.8, 1.4)',
    'INSERT INTO nutrition(pantry_item_id, calories, protein, carbs, fats) VALUES (5, 143, 12.2, 12.7, 9.9)',
    'INSERT INTO nutrition(pantry_item_id, calories, protein, carbs, fats) VALUES (6, 210, 1.4, 19.6, 1)',
    'INSERT INTO nutrition(pantry_item_id, calories, protein, carbs, fats) VALUES (7, 189, 31, 0, 3.6)',
    'INSERT INTO nutrition(pantry_item_id, calories, protein, carbs, fats) VALUES (8, 414, 24.3, 1, 35.2)',

    'INSERT INTO meal_slots(time) VALUES ("Breakfast")',
    'INSERT INTO meal_slots(time) VALUES ("Lunch")',
    'INSERT INTO meal_slots(time) VALUES ("Dinner")',

    'INSERT INTO meal_prep(meal_slots_id, pantry_item_id) VALUES (1, 3)',
    'SELECT * FROM meal_prep',

    'SELECT * FROM nutrition JOIN pantry_items ON nutrition.pantry_item_id = pantry_items.pantry_item_id',


    //INSERT PANTRY DATA
    'INSERT INTO pantry VALUES (1, "Jane Doe", "Pantry1", 54)',
    'INSERT INTO pantry VALUES (2, "Michael Wazowski","SinkPantry", 19)',
    'INSERT INTO pantry VALUES (3, "Sam Smith", "BathroomCloset", 6)',
    'INSERT INTO pantry VALUES (4, "Diva Diva","Fridge", 78)',
    'INSERT INTO pantry VALUES (5, "John Doe", "Pantryyyy", 34)',
    'INSERT INTO pantry VALUES (6, "Maia Papaya","My Pantry", 21)',
    'INSERT INTO pantry VALUES (7, "Nina Recio", "Sweet Treats", 12)',
    'INSERT INTO pantry VALUES (8, "Natasha Vithana","Laundry Stuff", 5)',
    'INSERT INTO pantry VALUES (9, "Mary Magdalene", "Food", 32)',
    'INSERT INTO pantry VALUES (10, "Matthew Roberts","Spice Cabinet", 21)',
    'INSERT INTO pantry VALUES (11, "Wednesday Adams", "Party Items", 18)',
    'INSERT INTO pantry VALUES (12, "Miguel Xavier","Cleaning Products", 7)',
    'INSERT INTO pantry VALUES (13, "Jane Doe","Fridge", 7)',

    'SELECT * FROM pantry',


    // INSERT USER DATA
    `INSERT INTO users (name, email, password_hash, profile_picture) 
     VALUES ('Jane Doe', 'jane.doe@example.com', 'hashed_password_here', 'https://via.placeholder.com/150')`,
    `INSERT INTO users (name, email, password_hash, profile_picture) 
     VALUES ('John Doe', 'john.doe@example.com', 'hashed_password_here', 'https://via.placeholder.com/150')`,
    `INSERT INTO users (name, email, password_hash, profile_picture) 
     VALUES ('Jimmy Doe', 'jimmy.doe@example.com', 'hashed_password_here', 'https://via.placeholder.com/150')`,
    `INSERT INTO users (name, email, password_hash) 
     VALUES ('Michael Wazowski', 'mike@monsters.inc', 'hashed_password_here')`,
    `INSERT INTO users (name, email, password_hash) 
     VALUES ('Sam Smith', 'sam.smith@example.com', 'hashed_password_here')`,

    // INSERT HOUSEHOLD DATA
    `INSERT INTO households (household_name, created_by) 
     VALUES ('Doe Family', 1)`,

    // INSERT SHOPPING LIST DATA 
    `INSERT INTO shopping_list (name, quantity) VALUES ('Apples', 2)`,
    `INSERT INTO shopping_list (name, quantity) VALUES ('Bananas', 3)`,
    `INSERT INTO shopping_list (name, quantity) VALUES ('Carrots', 1)`,
]

//For loop so it runs in order
maindb.serialize (() => {
    for (let i = 0; i < sql_array.length; i++) {
        let sql_string = sql_array[i]
        if(sql_string.trim().split(/\s+/)[0] === 'SELECT'){
            maindb.all(sql_string, [], (err, row) => {
                if(err) return console.error(err.message);
                row.forEach(row => {
                    console.log(row);
                })
            });
        } else {
            // let sql = sql_string;
            maindb.run(sql_string);
        }
        
    }
});
