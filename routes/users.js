const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1) CRUD operations for User

// Get all users (non-deleted)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ deleted: false }).populate('role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (non-deleted)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deleted: false }).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Soft delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User soft-deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2) Post /enable - True status if email and username match
router.post('/enable', async (req, res) => {
  const { email, username } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email, username, deleted: false },
      { status: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found or credentials incorrect' });
    res.json({ message: 'User status enabled', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3) Post /disable - False status if email and username match
router.post('/disable', async (req, res) => {
  const { email, username } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email, username, deleted: false },
      { status: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found or credentials incorrect' });
    res.json({ message: 'User status disabled', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
