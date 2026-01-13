const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

// POST /api/feedback
router.post('/feedback', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newFeedback = new Feedback({ name, email, subject, message });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

module.exports = router;
