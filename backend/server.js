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

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// backend/server.js

const _frontend = path.join(__dirname, '..', 'frontend');
app.use(express.static(_frontend));

// API Routes here
app.use('/api/auth', require('./routes/auth'));

// THE FINAL FIX: 
// This matches any route that does NOT start with /api 
// and sends it to your login page.
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(_frontend, 'login.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});