const express = require('express');
const { auth } = require('../firebase');
const router = express.Router();

// Login Page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Sign-up Page
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// Handle Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await auth.getUserByEmail(email); // Check if the user exists
    res.cookie('user', user.uid); // Store UID in a cookie
    res.redirect('/tasks');
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Invalid email or password' });
  }
});

// Handle Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Create the user in Firebase Auth
    const { auth } = require('../firebase');

    // Create a user
    await auth.createUser({
      email,
      password,
    });
    ``
    
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.render('signup', { error: error.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('user'); // Clear the user cookie
  res.redirect('/auth/login');
});

module.exports = router;
