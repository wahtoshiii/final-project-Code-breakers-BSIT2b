const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your MongoDB model

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user in MongoDB
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // 2. Check password (assuming plain text for testing, but use bcrypt in production!)
        if (user.password !== password) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // 3. SUCCESS! Send back the user's role and ID
        res.json({ 
            success: true, 
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                role: user.role // 'student' or 'seller'
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password, // In a real app, hash this with bcrypt first!
            role: role || 'student' 
        });

        await newUser.save();
        
        res.status(201).json({ 
            success: true, 
            message: "User registered successfully!",
            user: { id: newUser._id, name: newUser.name, role: newUser.role }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error during registration" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    if (user.password !== password) {
        return res.status(400).json({ error: "Invalid password" });
    }

    // Success! Send the user data including the role back to frontend
    res.json({
        user: {
            id: user._id,
            name: user.name,
            role: user.role
        }
    });
});

module.exports = router;