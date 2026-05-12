const express = require('express');
const router = express.Router();
const User = require('../models/User');
 
// 1. Create a user (POST)
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
 
// 2. Read all users (GET)
router.get('/all', async (req, res) => {
    try {
        // We use .select('-password') so it doesn't accidentally send user passwords to the frontend!
        const users = await User.find().select('-password'); 
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// 3. Update a user (PUT)
router.put('/:id', async (req, res) => {
  try {
    // The '{ new: true }' option tells Mongoose to return the updated user, not the old one.
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } 
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Delete a user (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }

  async function editUser(id) {
      const newName = prompt("Enter new name:");
      if (!newName) return;

      try {
          const res = await fetch(`/api/users/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newName })
          });
          
          if (res.ok) {
              fetchUsers(); // Refresh the list
          }
      } catch (error) {
          console.error("Update error:", error);
      }
  }
});
 
module.exports = router;