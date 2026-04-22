require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
 
const app = express();
connectDB();
 
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
 
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});