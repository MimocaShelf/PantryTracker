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
    let sql = 'INSERT INTO pantry_items(pantry_id, item_name, extra_info, quantity, unit) VALUES (?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.run(sql, [pantry_id, item_name, extra_info, quantity, unit], async (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
        //record item after creation
        let record_sql = 'INSERT INTO pantry_items_status_record (status, time, pantry_item_id, pantry_id, item_name, extra_info, quantity, unit) SELECT "C" as status, datetime("now", "+11 hours") as time, a.pantry_item_id, a.pantry_id, a.item_name, a.extra_info, a.quantity, a.unit FROM pantry_items a WHERE pantry_item_id = (SELECT max(b.pantry_item_id) FROM pantry_items b)'
        db.run(record_sql, [], async (err) => {
            if (err) {
                console.log(err)
            }
        })
    })
}
function deletePantryItemFromPantryItemID(pantry_item_id) {
    let sql = 'DELETE FROM pantry_items WHERE pantry_item_id = ?';
    return new Promise((resolve, reject) => {
        //record item before deleting
        let record_sql = 'INSERT INTO pantry_items_status_record (status, time, pantry_item_id, pantry_id, item_name, extra_info, quantity, unit) SELECT "D" as status, datetime("now", "+11 hours") as time, a.pantry_item_id, a.pantry_id, a.item_name, a.extra_info, a.quantity, a.unit FROM pantry_items a WHERE pantry_item_id = (SELECT max(b.pantry_item_id) FROM pantry_items b)'
        db.run(record_sql, [], async (err) => {

        })

        //delete item
        db.run(sql, [pantry_item_id], async (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })

    })
}



//get latest added item for testing purposes
async function getLatestAddedItem() {
    const sql = 'SELECT a.pantry_item_id, a.pantry_id, a.item_name, a.extra_info, a.quantity, a.unit FROM pantry_items a WHERE pantry_item_id = (SELECT max(b.pantry_item_id) FROM pantry_items b)'
    return new Promise((resolve, reject) => {
        db.get(sql, [], async (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}
async function getLatestAddedItemFromPantryID(pantry_id) {
    /*
        1. find maximum entry in pantry_items_status_record that:
            - matches given pantry_id 
            - has status 'C'
            - recorded pantry_item_id exists in pantry
        2. return matching row from pantry_items (in case it has been edited)
    */
    const sql = `
        SELECT a.time, d.*
        FROM pantry_items_status_record a 
        LEFT JOIN pantry_items d ON a.pantry_item_id = d.pantry_item_id
        WHERE a.history_id = (
            SELECT max(b.history_id) 
            FROM pantry_items_status_record b 
        ) AND
        a.pantry_id = ? AND 
        a.status = 'C' AND
        (
            SELECT COUNT(*) FROM pantry_items c WHERE a.pantry_item_id == c.pantry_item_id
        ) = 1
    `
    return new Promise((resolve, reject) => {
        db.get(sql, [pantry_id], async (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}
async function getLatestAddedItemHistory() {
    const sql = 'SELECT * FROM pantry_items_status_record a WHERE a.history_id = (SELECT max(b.history_id) FROM pantry_items_status_record b)'
    return new Promise((resolve, reject) => {
        db.get(sql, [], async (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}

function getPantriesForUser(user_id) {
    const sql = 'SELECT pantry_id, pantry_name FROM pantry LEFT JOIN users ON pantry.pantry_owner = users.name WHERE user_id = ?'
    return new Promise((resolve, reject) => {
        db.all(sql, [user_id], async (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}

function getPantryName(pantry_id) {
    const sql = 'SELECT pantry_name FROM pantry WHERE pantry_id = ?'
    return new Promise((resolve, reject) => {
        db.get(sql, [pantry_id], async (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}

function getPantryInformation(pantry_id) {
    const sql = 'SELECT * FROM pantry WHERE pantry_id = ?'
    return new Promise((resolve, reject) => {
        db.get(sql, [pantry_id], async (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}

function getPantryItemsFromPantryID(pantry_id) {
    const sql = 'SELECT * FROM pantry_items WHERE pantry_id = ?'
    return new Promise((resolve, reject) => {
        db.all(sql, [pantry_id], async (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}




export { addItemToPantry, getLatestAddedItem, getPantriesForUser, getPantryName, getPantryItemsFromPantryID, getPantryInformation, getLatestAddedItemHistory, deletePantryItemFromPantryItemID, getLatestAddedItemFromPantryID };