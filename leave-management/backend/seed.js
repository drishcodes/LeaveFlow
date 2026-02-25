const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Models
const User = require('./models/User');
const Leave = require('./models/Leave');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Leave.deleteMany({});
  console.log('Cleared existing data');

  // Create users
  const users = await User.insertMany([
    {
      name: 'Admin User',
      email: 'admin@demo.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'admin',
      department: 'Administration',
      leaveBalance: { annual: 20, sick: 15, casual: 10 }
    },
    {
      name: 'Sarah Johnson',
      email: 'manager@demo.com',
      password: await bcrypt.hash('manager123', 12),
      role: 'manager',
      department: 'Engineering',
      leaveBalance: { annual: 18, sick: 12, casual: 7 }
    },
    {
      name: 'John Employee',
      email: 'employee@demo.com',
      password: await bcrypt.hash('employee123', 12),
      role: 'employee',
      department: 'Engineering',
      leaveBalance: { annual: 15, sick: 10, casual: 5 }
    },
    {
      name: 'Alice Chen',
      email: 'alice@demo.com',
      password: await bcrypt.hash('alice123', 12),
      role: 'employee',
      department: 'Design',
      leaveBalance: { annual: 15, sick: 10, casual: 5 }
    },
    {
      name: 'Bob Martinez',
      email: 'bob@demo.com',
      password: await bcrypt.hash('bob123', 12),
      role: 'employee',
      department: 'Marketing',
      leaveBalance: { annual: 15, sick: 10, casual: 5 }
    },
  ]);

  const [admin, manager, employee, alice, bob] = users;

  // Create sample leaves
  const now = new Date();
  const d = (offset) => new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);

  await Leave.insertMany([
    {
      employee: employee._id,
      leaveType: 'annual',
      startDate: d(5),
      endDate: d(9),
      totalDays: 5,
      reason: 'Family vacation to the mountains',
      status: 'pending'
    },
    {
      employee: alice._id,
      leaveType: 'sick',
      startDate: d(-3),
      endDate: d(-1),
      totalDays: 3,
      reason: 'Medical appointment and recovery',
      status: 'approved',
      reviewedBy: manager._id,
      reviewComment: 'Approved. Take care!',
      reviewedAt: d(-2)
    },
    {
      employee: bob._id,
      leaveType: 'casual',
      startDate: d(1),
      endDate: d(1),
      totalDays: 1,
      reason: 'Personal errand',
      status: 'rejected',
      reviewedBy: manager._id,
      reviewComment: 'Project deadline this week, please reschedule',
      reviewedAt: d(-1)
    },
    {
      employee: employee._id,
      leaveType: 'sick',
      startDate: d(-10),
      endDate: d(-9),
      totalDays: 2,
      reason: 'Flu and fever',
      status: 'approved',
      reviewedBy: manager._id,
      reviewComment: 'Get well soon!',
      reviewedAt: d(-9)
    },
  ]);

  console.log('\n✅ Seed complete! Demo accounts:');
  console.log('  admin@demo.com / admin123');
  console.log('  manager@demo.com / manager123');
  console.log('  employee@demo.com / employee123');
  console.log('  alice@demo.com / alice123');
  console.log('  bob@demo.com / bob123');

  await mongoose.disconnect();
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
