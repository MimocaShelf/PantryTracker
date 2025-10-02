import db from './sql/app.js'

/*
    take input from addToPantry:
        - pantry (pantry_name)
        - item_name
        - extra_info
        - quantity
        - unit (of measurement)
    add to database
*/


function addItemToPantry(pantry_id, item_name, extra_info, quantity, unit) {


    let sql_string = 'INSERT INTO pantry_items(pantry_id, item_name, extra_info, quantity, unit) VALUES (?, ?, ?, ?, ?)';
    
    let addToDatabase = (pantry_id, item_name, extra_info, quantity, unit) => {
        db.run(sql_string, [pantry_id, item_name, extra_info, quantity, unit], (err) => {
            if (err) return console.error(err.message);
        })
    }

    // addToDatabase('main_pantry', 'Apple', null, 10, 'units')
    try {
        addToDatabase(pantry_id, item_name, extra_info, quantity, unit);
    } catch (err) {
        console.error(err.message);
    }
}



//get latest added item for testing purposes
function getLatestAddedItem(callback) {
    const sql = 'SELECT a.pantry_item_id, a.pantry_id, a.item_name, a.extra_info, a.quantity, a.unit FROM pantry_items a WHERE pantry_item_id = (SELECT max(b.pantry_item_id) FROM pantry_items b)'
    db.get(sql, [], callback)
}

function getPantriesForUser(user_id, callback) {
    const sql = 'SELECT pantry_id, pantry_name FROM pantry LEFT JOIN users ON pantry.pantry_ownder = users.name WHERE user_id = ?'
    db.all(sql, [user_id], callback)
}




export {addItemToPantry, getLatestAddedItem, getPantriesForUser};