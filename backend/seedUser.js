require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.js'); // Make sure this path points to your User model

// Connect to the DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to DB for seeding...'))
    .catch(err => console.error(err));

const seedDatabase = async () => {
    try {
        // Optional: Clears out old test users so you have a fresh start
        await User.deleteMany({}); 

        const adminUser = {
            name: "Admin User",
            email: "admin@bup.edu.ph",
            password: "adminpassword",
            role: "admin"
        };

        // Create our two distinct test accounts
        await User.create([
            { 
                name: "Joshua Olarcos", 
                email: "joshualoria.olarcos24@bicol-u.edu.ph", 
                password: "password123", // Keep it simple for testing!
                role: "student" 
            },
            { 
                name: "Grace Ann Carilla", 
                email: "graceannsumpay.carilla24@bicol-u.edu.ph", 
                password: "password123", 
                role: "seller" 
            }
        ]);

        console.log('✅ Test Users Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
};

seedDatabase();