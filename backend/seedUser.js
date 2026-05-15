require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // 1. IMPORT ADDED HERE
const User = require('./models/User.js'); 

// Connect to the DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to DB for seeding...'))
    .catch(err => console.error(err));

const seedDatabase = async () => {
    try {
        // 2. Hash the password "password123" so it's secure
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 3. Inject the secure hashedPassword into the test accounts
        await User.create([
            { 
                name: "Joshua Olarcos", 
                email: "joshualoria.olarcos24@bicol-u.edu.ph", 
                password: hashedPassword, // SECURE HASH APPLIED
                role: "admin" 
            },
            { 
                name: "Grace Ann Carilla", 
                email: "graceannsumpay.carilla24@bicol-u.edu.ph", 
                password: hashedPassword, // SECURE HASH APPLIED
                role: "seller" 
            }
        ]);

        console.log('✅ Test Users Seeded Successfully with SECURE passwords!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
};

seedDatabase();