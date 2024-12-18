const express = require('express');
const { db } = require('../firebase'); // Firebase Realtime Database reference
const router = express.Router();

// Middleware to check auth
const checkAuth = (req, res, next) => {
  if (!req.cookies.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Task Page
router.get('/', checkAuth, async (req, res) => {
  try {
    // Fetch tasks from Realtime Database for the logged-in user
    const tasksSnapshot = await db.ref(`tasks/${req.cookies.user}`).once('value');
    const tasks = [];
    
    tasksSnapshot.forEach((childSnapshot) => {
      tasks.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    res.render('tasks', { tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add Task
router.post('/add', checkAuth, async (req, res) => {
  const { title } = req.body;
  const userId = req.cookies.user;

  try {
    // Save task in Realtime Database under the user's node
    const newTaskRef = db.ref(`tasks/${userId}`).push();
    await newTaskRef.set({
      title,
      createdAt: new Date().toISOString(),
    });

    res.redirect('/tasks');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete Task
router.post('/delete/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.cookies.user;

  try {
    // Remove task from Realtime Database
    await db.ref(`tasks/${userId}/${id}`).remove();
    res.redirect('/tasks');
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
