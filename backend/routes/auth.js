const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    const { name, phone, password, email } = req.body;

    // Basic validation
    if (!name || !phone || !password) {
      return res.status(400).json({ 
        message: 'Name, phone and password are required' 
      });
    }

    // Check if user exists by phone
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this phone number' 
      });
    }

    // If email is provided, check if it exists
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ 
          message: 'User already exists with this email' 
        });
      }
    }

    // Create user object
    const userData = { 
      name: name.trim(), 
      phone: phone.trim(), 
      password: password 
    };

    // Only add email if provided and not empty
    if (email && email.trim()) {
      userData.email = email.trim().toLowerCase();
    }

    // Create user
    const user = new User(userData);

    await user.save();
    console.log('User saved successfully');

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret_key_123', { 
      expiresIn: '7d' 
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('REGISTRATION ERROR:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `User with this ${field} already exists` 
      });
    }
    
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ 
        message: 'Phone and password are required' 
      });
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid phone number or password' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid phone number or password' 
      });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret_key_123', { 
      expiresIn: '7d' 
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ 
      message: 'Login failed',
      error: error.message 
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('AUTH CHECK ERROR:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;