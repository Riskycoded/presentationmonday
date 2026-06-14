const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');

// Protect routes using Passport Custom Session Strategy
const protect = passport.authenticate('session', { session: false });

// @desc    Submit a contact form inquiry
// @route   POST /api/contacts
router.post('/', async (req, res, next) => {
  try {
    const db = await connectDB();
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and message' });
    }

    // Basic email regex check
    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }

    const newContact = {
      name,
      email,
      message,
      read: false,
      createdAt: new Date()
    };

    const result = await db.collection('contacts').insertOne(newContact);
    res.status(201).json({ success: true, data: { _id: result.insertedId, ...newContact } });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all contact inquiries (Admin Only)
// @route   GET /api/contacts
router.get('/', protect, async (req, res, next) => {
  try {
    const db = await connectDB();
    const contacts = await db.collection('contacts')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// @desc    Mark a contact message as read (Admin Only)
// @route   PUT /api/contacts/:id/read
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const db = await connectDB();
    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { read: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Contact message not found' });
    }

    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
