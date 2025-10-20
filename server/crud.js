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

const readAllPantries = (callback) => {
    const sql = 'SELECT * FROM pantry';
    db.all(sql, [], callback);
}

const readAllRecipe = (callback) => {
    const sql = 'SELECT * FROM recipe';
    db.all(sql, [], callback);
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

const deletePantry = (pantryId, callback) => {
  const sql = 'DELETE FROM pantry WHERE pantry_id = ?';
  db.run(sql, [pantryId], function (err) {
    callback(err, { changes: this.changes });
  });
};

const deleteRecipe = (name, callback) => {
  const sql = 'DELETE FROM recipe WHERE recipe_name = ?';
  db.run(sql, [name], function (err) {
    callback(err, { changes: this.changes });
  });
};

//INSERT
const insertPantryItemToMealPrep = (time, itemName, callback) => {
    const sql = 'INSERT INTO meal_prep (meal_slots_id, pantry_item_id) VALUES (?, ?)'
    db.run(sql, [time, itemName], function(err) {
        callback(err, { id: this.lastID })
    }) 
}

const insertIntoRecipe = (name, callback) => {
    const sql = 'INSERT INTO recipe (recipe_name) VALUES (?)'
    db.run(sql, [name], function(err) {
        callback(err, { id: this.lastID })
    }) 
}

const checkIfItemRecordExistInMealPrep = (time, itemName, callback) => {
    const sql = 'SELECT * FROM meal_prep WHERE meal_slots_id = ? AND pantry_item_id = ?'
    db.all(sql, [time, itemName], callback)
}

const checkIfRecipeIsSaved = (name, callback) => {
    const sql = 'SELECT * FROM recipe WHERE recipe_name = ?'
    db.all(sql, [name], callback)
}

const insertPantry = (owner, name, callback) => {
  const sql = 'INSERT INTO pantry (pantry_owner, pantry_name, pantry_itemAmount) VALUES (?, ?, ?)';
  db.run(sql, [owner, name, 0], function (err) {
    callback(err, { pantry_id: this.lastID });
  });
};


export {readPantryItems, readSpecificPantryItems, insertPantryItemToMealPrep, readBreakfastIngredients, readLunchIngredients, readDinnerIngredients, deleteMealPrepItem, checkIfItemRecordExistInMealPrep, readAllPantries, insertPantry, deletePantry, deleteRecipe, insertIntoRecipe, checkIfRecipeIsSaved, readAllRecipe}