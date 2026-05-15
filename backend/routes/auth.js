const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User'); 

// ==========================================
// 1. REGISTER ROUTE
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const newUser = new User({
            name,
            email,
            password, 
            role: role || 'student' 
        });

        // Hash the password BEFORE saving
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
        
        res.status(201).json({ 
            success: true, 
            message: "User registered successfully!",
            user: { id: newUser._id, name: newUser.name, role: newUser.role }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// ==========================================
// 2. LOGIN ROUTE
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Account does not exist. Please register." });
        }

        // 🚨 THE CONFESSION LOG 🚨
        console.log("\n=== LOGIN DEBUG ===");
        console.log("1. Email Typed:", email);
        console.log("2. Password Typed:", password);
        console.log("3. Password in DB :", user.password);
        console.log("===================\n");

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);

        // Success
        res.status(200).json({ 
            message: "Login successful", 
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;