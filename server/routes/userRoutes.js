import express from 'express';
import { createUser, readUserById, updateUser, deleteUser } from '../services/userService.js';

const app = express();

// Create user
app.post('/', (req, res) => {
    const { name, email, password } = req.body;
    createUser(name, email, password, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Read user by ID
app.get('/:id', (req, res) => {
    const userId = req.params.id;
    readUserById(userId, (err, user) => {
        if (err) return res.status(500).send(err.message);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    });
});

// Update user
app.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { name, profilePicture } = req.body;  
    updateUser(userId, name, profilePicture, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});
app.delete('/:id', (req, res) => {
    const userId = req.params.id;
    deleteUser(userId, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

export default app;