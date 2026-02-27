const express = require('express');
const app = express();
const port = 3000;  

//Middleware to parse JSON bodies
app.use(express.json());

//In memory data store for users
let users = [];
let currentId = 1;

/**
 * Create a new user
 * POST /users
 * Body: { "name": "John Doe", "email": "   
 */
app.get('/', (req, res) => {
    res.send('Welcome to the Users API 🚀');
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;   
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }   
    const newUser = { id: currentId++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

/**
 * Get all users
 * GET /users
 */
app.get('/users', (req, res) => {
    res.json(users);
});

/**
 * Get a user by ID
 * GET /users/:id
 */
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }   

    const { id, name, email } = req.body;

    if (id !== userId) {
        return res.status(400).json({ error: 'ID in body does not match ID in URL' });
    }
    if(!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
   
    user.name = name;
    user.email = email;
    res.json(user);
});

/**
 * Delete a user by ID
 * DELETE /users/:id
 */
app.delete('/users/:id', (req, res) => {
   const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    const deletedUser = users.splice(index, 1);
    res.json(deletedUser[0]);
});

//start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});