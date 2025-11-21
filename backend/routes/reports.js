const express = require('express');
const Report = require('../models/report');
const auth = require('../middleware/auth'); // Add this import
const router = express.Router();

// Get all reports for user
router.get('/', auth, async (req, res) => { // Add auth middleware
  try {
    // Only get reports for the logged-in user
    const reports = await Report.find({ user: req.user._id });
    res.json(reports);
  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new report
router.post('/', auth, async (req, res) => { // Add auth middleware
  try {
    const { type, location } = req.body;

    const report = new Report({
      type,
      location,
      user: req.user._id // Add this line - user ID from authenticated user
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete report
router.delete('/:id', auth, async (req, res) => { // Add auth middleware
  try {
    // Only allow deleting reports that belong to the user
    const report = await Report.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;