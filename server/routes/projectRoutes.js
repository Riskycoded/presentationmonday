const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');

// Protect routes using Passport Custom Session Strategy
const protect = passport.authenticate('session', { session: false });

// @desc    Get all projects (with native MongoDB filter query)
// @route   GET /api/projects?category=frontend
router.get('/', async (req, res, next) => {
  try {
    const db = await connectDB();
    const filterQuery = {};

    // Apply native MongoDB filtering based on category search query
    if (req.query.category && req.query.category !== 'all') {
      filterQuery.category = req.query.category;
    }

    // Retrieve documents as an array, sorted by creation date descending
    const projects = await db.collection('projects')
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectDB();
    const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// @desc    Add a project (Admin Only)
// @route   POST /api/projects
router.post('/', protect, async (req, res, next) => {
  try {
    const db = await connectDB();
    const { title, description, image, tags, github, live, category, role, outcome } = req.body;

    if (!title || !description || !category || !role) {
      return res.status(400).json({ success: false, error: 'Please provide title, description, category, and role' });
    }

    const newProject = {
      title,
      description,
      image: image || 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&h=400&fit=crop',
      tags: tags || [],
      github: github || '#',
      live: live || '#',
      category,
      role,
      outcome: outcome || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('projects').insertOne(newProject);
    res.status(201).json({ success: true, data: { _id: result.insertedId, ...newProject } });
  } catch (error) {
    next(error);
  }
});

// @desc    Update a project (Admin Only)
// @route   PUT /api/projects/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const db = await connectDB();
    const projectId = req.params.id;

    // Remove _id from req.body if it exists to avoid MongoDB immutable ID error
    const updateData = { ...req.body };
    delete updateData._id;

    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(projectId) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Get the updated project to return it
    const updatedProject = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    res.json({ success: true, data: updatedProject });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a project (Admin Only)
// @route   DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const db = await connectDB();
    const projectId = req.params.id;

    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(projectId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
