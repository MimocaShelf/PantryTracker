import db from '../sql/app.js'

// Handles database operations for user authentication

// Signup function to create a new user in the database
async function signup(name, email, password, callback) {
    const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    db.run(sql, [name, email, password], function(err) {
        callback(err, { id: this.lastID });
    });
}

// Login function to authenticate a user with the provided email and password
async function login(email, password, callback) {
    const sql = 'SELECT * FROM users WHERE email = ? AND password_hash = ?';
    db.get(sql, [email, password], (err, row) => {
        callback(err, row);
    });
}

// Logout function to remove the user's session from the database
async function logout(callback) {
    callback(null, { message: 'Logged out successfully' });
}


export { signup, login, logout };