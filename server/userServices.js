import db from './sql/app.js'

// Create User
const createUser = (name, email, password, callback) => {
    const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    db.run(sql, [name, email, password], function(err) {
        callback(err, { id: this.lastID }); 
    });
  }

// Read User By Email
const readUserByEmail = (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        callback(err, row);
    });
}

// Read User By ID
const readUserById = (user_id, callback) => {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    db.get(sql, [user_id], (err, row) => {
        callback(err, row);
    });
}

// Update User
const updateUser = (user_id, name, profilePicture, callback) => {
    const sql = 'UPDATE users SET name = ?, profile_picture = ? WHERE user_id =  ';
    db.run(sql, [name, profilePicture, user_id], function(err) {
        callback(err, { changes: this.changes });
    });
}

// Delete User
const deleteUser = (user_id, callback) => {
    const sql = 'DELETE FROM users WHERE user_id = ?';   
    db.run(sql, [user_id], function(err) {
        callback(err, { changes: this.changes });
    });
}

export { createUser, readUserByEmail, readUserById, updateUser, deleteUser };

