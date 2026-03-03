const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;  
const SECRET_KEY = 'mySuperSecretKey';

//Fake user for authentication
const users = [];

//Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));

//In memory data store for users

let currentId = 1;

const cors = require('cors');
app.use(cors());
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

/*===============================
SIGNUP AND LOGIN ENDPOINTS
*/
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        username,
        password: hashedPassword,
        role: 'user'
    });
    res.status(201).json({ message: 'User created successfully' });
});

/*
===========================
Login
==========================
*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });

    }

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
    res.json({ token });
});

const { authenticateToken, authorizeRole } = require('./middleware/auth');

/*
============================
PROTECTED ROUTE(Any Logged User)
============================
*/
app.get('profile', authenticateToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}! This is your profile. Profile accessed` });
});

/**
 * 
 * =============================
 * Admin Only Route
 * ============================
 */

app.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: `Welcome Admin ${req.user.username}! This is the admin panel.` });
});

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// }   );
//start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',   // XAMPP default is empty
//   database: 'codveda'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Database connection failed:', err);
//   } else {
//     console.log('Connected to MySQL');
//   }
// });

// app.post('/users', (req, res) => {
//   const { name, email, age } = req.body;

//   const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
//   db.query(sql, [name, email, age], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: 'User added successfully', id: result.insertId });
//   });
// });
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/codvedaDB')
.then(() => console.log('MangoDB Connected'))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const User = mongoose.model('User', userSchema);

app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;        
    try {
        const newUser = new User({ name, email, age });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
}); 

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});