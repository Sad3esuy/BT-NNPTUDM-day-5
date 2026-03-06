const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get role by ID
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create role
router.post('/', async (req, res) => {
  const role = new Role({
    name: req.body.name,
    description: req.body.description
  });
  try {
    const newRole = await role.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRole) return res.status(404).json({ message: 'Role not found' });
    res.json(updatedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete role (Hard delete as not specified soft delete for role, but can easily be soft)
router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
