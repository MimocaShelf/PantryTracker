import db from './sql/app.js'

//READ
const readPantryItems = (callback) => {
    const sql = 'SELECT * FROM pantry_items';
    db.all(sql, [], callback)
}

const readSpecificPantryItems = (name, callback) => {
    const sql = 'SELECT * FROM pantry_items WHERE item_name LIKE ?';
    const param = `%${name}%`;

    db.all(sql, [param], (err, rows) => {
        callback(err, rows)
    })
}

const readBreakfastIngredients = (callback) => {
    const sql = 'SELECT * FROM meal_prep INNER JOIN pantry_items ON meal_prep.pantry_item_id = pantry_items.pantry_item_id WHERE meal_slots_id = 1';
    db.all(sql, [], callback)
}

const readLunchIngredients = (callback) => {
    const sql = 'SELECT * FROM meal_prep INNER JOIN pantry_items ON meal_prep.pantry_item_id = pantry_items.pantry_item_id WHERE meal_slots_id = 2';
    db.all(sql, [], callback)
}

const readDinnerIngredients = (callback) => {
    const sql = 'SELECT * FROM meal_prep INNER JOIN pantry_items ON meal_prep.pantry_item_id = pantry_items.pantry_item_id WHERE meal_slots_id = 3';
    db.all(sql, [], callback)
}

const deleteMealPrepItem = (pantry_Id, meal_slot_id, callback) => {
    const sql = 'DELETE FROM meal_prep WHERE pantry_item_id = ? and meal_slots_id = ?'
    db.run(sql, [pantry_Id, meal_slot_id], callback)
}

//INSERT
const insertPantryItemToMealPrep = (time, itemName, callback) => {
    const sql = 'INSERT INTO meal_prep (meal_slots_id, pantry_item_id) VALUES (?, ?)'
    db.run(sql, [time, itemName], function(err) {
        callback(err, { id: this.lastID })
    }) 
}

export {readPantryItems, readSpecificPantryItems, insertPantryItemToMealPrep, readBreakfastIngredients, readLunchIngredients, readDinnerIngredients, deleteMealPrepItem}