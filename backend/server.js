require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');

const app = express();
connectDB();

const path = require('path');

// 1. Tell Express where your frontend files are located
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Point the main URL (/) to your login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

// 3. Catch-all: If someone goes to a broken link, send them to login
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});