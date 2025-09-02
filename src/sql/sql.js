/*
    Add SQL strings to the array, and it will run them in order

*/
const sql_array = [
    //DROP TABLES
    'DROP TABLE IF EXISTS pantry_items',

    //CREATE TABLES
    `CREATE TABLE pantry_items (
        pantry_id INTEGER,
        item_name VARCHAR(100),
        quantity DECIMAL(20, 5),
        unit VARCHAR(50)
    )`,








    //INSERT DATA
    'INSERT INTO pantry_items VALUES (0, "Apple", 4, "units")',
    'INSERT INTO pantry_items VALUES (0, "Flour", 2.5, "kilograms")',
]

//For loop so it runs in order
for (let i = 0; i < sql_array.length; i++) {
    let sql = sql_array[i];
    maindb.run(sql_array[i]);
}