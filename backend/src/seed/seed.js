import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Lead from '../models/Lead.js';

dotenv.config();

export const sampleLeads = [
  {
    name: 'Alexander Wright',
    email: 'a.wright@apextech.io',
    phone: '+1 (555) 234-5678',
    company: 'Apex Tech Solutions',
    serviceInterested: 'Enterprise Cloud Migration',
    status: 'New',
    followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    notes: 'Inquired through web form. Requesting architecture breakdown.',
  },
  {
    name: 'Sophia Martinez',
    email: 'smartinez@innovatehealth.org',
    phone: '+1 (555) 345-6789',
    company: 'Innovate Health',
    serviceInterested: 'HIPAA Compliance Audit',
    status: 'Contacted',
    followUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    notes: 'Introductory call conducted. Waiting on their compliance officer input.',
  },
  {
    name: 'Marcus Vance',
    email: 'mvance@vanceholdings.com',
    phone: '+1 (555) 456-7890',
    company: 'Vance Capital',
    serviceInterested: 'Custom FinTech Dashboard',
    status: 'Qualified',
    followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    notes: 'Budget approved ($45k-$60k). Demo scheduled for Thursday.',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@novasoftware.eu',
    phone: '+44 20 7946 0912',
    company: 'Nova Software UK',
    serviceInterested: 'Full-Stack Dedicated Squad',
    status: 'Converted',
    followUpDate: null,
    notes: 'Contract signed for 6-month initial commitment. Onboarding initiated.',
  },
  {
    name: 'David Chen',
    email: 'david.chen@synergyretail.com',
    phone: '+1 (555) 567-8901',
    company: 'Synergy Retail Group',
    serviceInterested: 'E-commerce Headless Re-platform',
    status: 'Lost',
    followUpDate: null,
    notes: 'Project deferred to Q3 due to internal restructuring.',
  },
  {
    name: 'Rachel Adams',
    email: 'rachel@luminarymarketing.com',
    phone: '+1 (555) 678-9012',
    company: 'Luminary Media',
    serviceInterested: 'SEO & Content Automation Platform',
    status: 'New',
    followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    notes: 'Interested in automated reporting module.',
  },
  {
    name: 'Jordan Rivera',
    email: 'jrivera@quantumsystems.dev',
    phone: '+1 (555) 789-0123',
    company: 'Quantum Systems',
    serviceInterested: 'Kubernetes Infrastructure Support',
    status: 'Qualified',
    followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    notes: 'Requires 24/7 SLA coverage. Proposal submitted.',
  },
  {
    name: 'Camila Rossi',
    email: 'camila@verdesolar.com',
    phone: '+1 (555) 890-1234',
    company: 'Verde Renewable Energy',
    serviceInterested: 'IoT Telemetry Pipeline',
    status: 'Contacted',
    followUpDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    notes: 'Discussed sensor streaming volumes (~2M events/day).',
  },
];

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already has users. Skipping auto-seed.');
      return;
    }

    console.log('[Seed] Seeding initial database records...');

    // Create Demo Admin User
    const demoUser = await User.create({
      name: 'Sarah Connor',
      email: 'admin@leadflow.com',
      password: 'Password123!',
      role: 'admin',
    });
    console.log(`[Seed] Created Demo User: ${demoUser.email} (Password: Password123!)`);

    // Attach user ID to demo leads
    const leadsWithUser = sampleLeads.map((lead) => ({
      ...lead,
      createdBy: demoUser._id,
      assignedTo: demoUser._id,
    }));

    await Lead.insertMany(leadsWithUser);
    console.log(`[Seed] Seeded ${leadsWithUser.length} sample leads successfully.`);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
  }
};

// If executed directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      await User.deleteMany({});
      await Lead.deleteMany({});
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
