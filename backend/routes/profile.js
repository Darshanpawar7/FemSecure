const express = require('express');
const router = express.Router();

// Update location
router.put('/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    // For now, just return success - we'll add user saving later
    res.json({ 
      message: 'Location updated successfully',
      location: { latitude, longitude }
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;