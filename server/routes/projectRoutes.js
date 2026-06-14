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

// @desc    Seed projects into database (Alternative to Shell)
// @route   GET /api/projects/seed
router.get('/seed', async (req, res, next) => {
  try {
    const db = await connectDB();
    const seedProjects = [
      {
        title: "Jeropath International",
        description: "Study abroad agency website connecting students with international education opportunities. Features comprehensive service listings, destination guides, and inquiry forms.",
        image: "https://raw.githubusercontent.com/Riskycoded/presentationmonday/main/craft-portfolio/src/assets/screenshot.png",
        tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
        github: "https://github.com/Riskycoded/Jeropathinternational",
        live: "https://jeropathinternational.vercel.app/",
        category: "fullstack",
        role: "Frontend Developer",
        outcome: "Client project delivering modern study abroad consultancy platform.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Car Rental Service",
        description: "Modern car rental platform with booking management, vehicle filtering, and user reviews.",
        image: "https://raw.githubusercontent.com/Riskycoded/presentationmonday/main/craft-portfolio/src/assets/mrscar.png",
        tags: ["React", "D3.js", "WebSocket", "Docker"],
        github: "#",
        live: "#",
        category: "fullstack",
        role: "Frontend Developer",
        outcome: "Clean vehicle booking application with modern UI/UX.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Team Task Manager",
        description: "Collaborative task management application with real-time updates. Features include dashboard analytics, kanban boards, team chat, calendar scheduling, and user settings.",
        image: "https://raw.githubusercontent.com/Riskycoded/presentationmonday/main/craft-portfolio/src/assets/TeamApp.png",
        tags: ["Next.js", "OpenAI", "TypeScript", "Tailwind"],
        github: "https://github.com/Riskycoded/finalpresentation",
        live: "https://finalpresentation-puce.vercel.app/",
        category: "frontend",
        role: "Full-Stack Developer",
        outcome: "Built comprehensive team collaboration tool with real-time features.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Design System Library",
        description: "Comprehensive component library with accessible components, theming support, and automated documentation.",
        image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&h=400&fit=crop",
        tags: ["React", "TypeScript", "Tailwind CSS"],
        github: "#",
        live: "#",
        category: "frontend",
        role: "Frontend Developer",
        outcome: "Reusable component library for consistent design.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Social Media Analytics",
        description: "Cross-platform analytics tool aggregating data from multiple social networks with engagement tracking.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        tags: ["React", "TypeScript", "Firebase", "Chart.js"],
        github: "#",
        live: "#",
        category: "fullstack",
        role: "Full-Stack Developer",
        outcome: "Analytics dashboard for social media insights.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('projects').deleteMany({});
    const result = await db.collection('projects').insertMany(seedProjects);
    res.json({ success: true, message: `Successfully seeded ${result.insertedCount} projects into MongoDB!` });
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
