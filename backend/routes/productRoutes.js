const express = require('express');
const router = express.Router();

// 1. IMPORT THE PRODUCT MODEL
// (Make sure the path matches exactly where the models folder is located)
const Product = require('../models/Product'); 

// 2. POST — create a new product OR update stock if it already exists
router.post('/', async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    // Step 1: Search the database to see if this exact item name already exists
    const existingProduct = await Product.findOne({ name: name });

    if (existingProduct) {
        // Step 2: If it DOES exist, just add the new stock to the existing stock!
        existingProduct.stock += parseInt(stock);
        
        // We also update it to the newest price, just in case you changed it
        existingProduct.price = parseFloat(price); 
        
        const updatedProduct = await existingProduct.save();
        return res.status(200).json(updatedProduct);
    } else {
        // Step 3: If it DOES NOT exist, create a brand new product entry
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        return res.status(201).json(savedProduct);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 3. GET all products (Removed the hardcoded placeholder)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 4. GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 5. PUT — update product by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

// 6. DELETE — delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 7. EXPORT THE ROUTER (This must ALWAYS be the absolute last line)
module.exports = router;