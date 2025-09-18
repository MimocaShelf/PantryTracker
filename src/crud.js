import db from './sql/app.js'

//READ
const readPantryItems = (callback) => {
    const sql = 'SELECT * FROM pantry_items';
    db.all(sql, [], callback)
}

const readSpecificPantryItems = (name, callback) => {
    const sql = 'SELECT * FROM pantry_items WHERE item_name LIKE ?';
    const param = `%{name}%`;

    db.all(sql, [name], (err, rows) => {
        callback(err, rows)
    })
}

export {readPantryItems, readSpecificPantryItems}