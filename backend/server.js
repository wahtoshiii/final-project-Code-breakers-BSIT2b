const path = require('path');
// This forces dotenv to look inside the backend folder for the .env file
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Define API Routes FIRST
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// 2. Resolve Static Files
// Using path.resolve ensures Render finds the folder regardless of root settings
const frontendPath = path.resolve(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// 3. The "Safe Mode" Catch-all
// This handles the PathError from image_3974be.png by avoiding wildcards
app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(frontendPath, 'login.html'), (err) => {
        if (err) {
            // If login.html is missing, this prevents the server from hanging
            res.status(500).send("Frontend files missing. Check folder naming.");
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Code-Breakers Server running on port ${PORT}`);
});