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

const path = require('path');

// Resolve the frontend path clearly
const frontendPath = path.join(__dirname, '..', 'frontend');

// Serve static files
app.use(express.static(frontendPath));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes'));

// THE SAFE FIX: 
// Instead of a wildcard string, use a basic Express function
app.use((req, res, next) => {
    // If the request is for an API, move on to the next handler
    if (req.url.startsWith('/api')) {
        return next();
    }
    // Otherwise, send the login page
    res.sendFile(path.join(frontendPath, 'login.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});