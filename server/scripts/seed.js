require('dotenv').config();
const { MongoClient } = require('mongodb');

const seedProjects = [
  {
    title: "Jeropath International",
    description: "Study abroad agency website connecting students with international education opportunities. Features comprehensive service listings, destination guides, and inquiry forms.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    tags: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
    github: "https://github.com/Riskycoded/Jeropathinternational",
    live: "https://jeropathinternational.vercel.app/",
    category: "frontend",
    role: "Full-Stack Developer",
    outcome: "Client project delivering modern study abroad consultancy platform.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Car Rental Service",
    description: "Modern car rental platform with booking management, vehicle filtering, and user reviews.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    tags: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
    github: "#",
    live: "#",
    category: "frontend",
    role: "Full-Stack Developer",
    outcome: "Clean vehicle booking application with modern UI/UX.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Team Task Manager",
    description: "Collaborative task management application with real-time updates. Features include dashboard analytics, kanban boards, team chat, calendar scheduling, and user settings.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop",
    tags: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
    github: "https://github.com/Riskycoded/finalpresentation",
    live: "https://finalpresentation-puce.vercel.app/",
    category: "fullstack",
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
    role: "Full-Stack Developer",
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

async function seedDatabase() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    console.log('🔌 Connected to MongoDB for seeding...');

    // Clear existing projects to avoid duplicate seeds
    await db.collection('projects').deleteMany({});
    console.log('🗑️ Existing projects deleted!');

    // Insert seeds
    const result = await db.collection('projects').insertMany(seedProjects);
    console.log(`🎉 Successfully seeded ${result.insertedCount} projects into MongoDB!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
