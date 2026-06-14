const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');
const { Resend } = require('resend');

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

    // Send email notification via Resend SDK
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'adebanjom16@gmail.com';

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const { data, error } = await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: [adminEmail],
          subject: `New Portfolio Message from ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #6366f1; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Inquiry Received</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #f3f4f6; font-style: italic;">
                "${message}"
              </div>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 11px; color: #9ca3af;">Sent from your portfolio contact form.</p>
            </div>
          `
        });

        if (error) {
          console.error('❌ Resend SDK Error:', error);
        } else {
          console.log('📧 Email sent successfully! ID:', data.id);
        }
      } catch (emailErr) {
        console.error('❌ Failed to send email via Resend:', emailErr.message);
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured. Skipping email notification.');
    }

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
