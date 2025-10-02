import express from 'express';
import { login, registerUser } from '../services/authService.js';
import { isValidEmail, isValidPassword } from '../services/ultilityService.js';

// Handles auth routes and logic

const app = express();

// Login user
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate email
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    login(email, password, (err, user) => {
        if (err) return res.status(500).send(err.message);
        res.json(user);
    });
});

// Signup user
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Validate email and password
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Invalid password format.' });
    }
    registerUser(name, email, password, (err, user) => {
        if (err) return res.status(500).send(err.message);
        res.json(user);
    });
});


export default app;