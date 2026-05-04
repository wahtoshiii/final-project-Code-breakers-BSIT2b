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

// 1. Static folder setup
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// 2. Specific route for the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

// 3. UPDATED Catch-all route (The fix for your specific error)
app.get('/*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
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