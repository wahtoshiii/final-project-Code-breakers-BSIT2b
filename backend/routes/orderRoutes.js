const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. POST — CREATE a new order
// Users will hit this route when they click "Order Now" on the shop page
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});

// 2. GET — Read all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 3. GET — Read single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 4. PUT — Update order by ID (Used by Accept/Decline/Ready buttons)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status }, // Dynamically grabs whatever status the frontend sends
      { new: true } // Returns the newly updated document
    );
    
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
    
  } catch (err) {
    console.error("Backend Update Error:", err);
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

// 5. DELETE — Delete order by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;