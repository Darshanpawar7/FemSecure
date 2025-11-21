const express = require('express');
const Contact = require('../models/contact');
const auth = require('../middleware/auth'); // Add this
const router = express.Router();

// Get all contacts for user
router.get('/', auth, async (req, res) => { // Add auth
  try {
    const contacts = await Contact.find({ user: req.user._id }); // Filter by user
    res.json(contacts);
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new contact
router.post('/', auth, async (req, res) => { // Add auth
  try {
    const { name, phone } = req.body;

    const contact = new Contact({
      name,
      phone,
      user: req.user._id // Add user ID
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact
router.delete('/:id', auth, async (req, res) => { // Add auth
  try {
    const contact = await Contact.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;