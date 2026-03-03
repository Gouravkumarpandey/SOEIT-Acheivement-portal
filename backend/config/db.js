const mongoose = require('mongoose');
const User = require('../models/User');

let mongoServer = null;

const seedDemoUsers = async () => {
  try {
    const University = require('../models/University');

    // 1. Create Default University for demo data
    const defaultUni = await University.findOneAndUpdate(
      { slug: 'aju' },
      {
        name: 'Arka Jain University',
        slug: 'aju',
        primaryColor: '#1e3a8a',
        secondaryColor: '#facc15',
        domain: 'arkajainuniversity.ac.in'
      },
      { upsert: true, returnDocument: 'after' }
    );

    const demoUsers = [
      {
        name: 'Demo Student',
        email: 'student@soeit.ac.in',
        enrollmentNo: 'AJU/221403',
        password: 'Test@123',
        role: 'student',
        department: 'CSE',
        batch: '2022',
        semester: 4,
        universityId: defaultUni._id,
        isActive: true
      },
      {
        name: 'Demo Faculty',
        email: 'faculty@soeit.ac.in',
        enrollmentNo: 'AJU/FACULTY',
        password: 'Faculty@123',
        role: 'faculty',
        department: 'CSE',
        universityId: defaultUni._id,
        isActive: true
      },
      {
        name: 'System Admin',
        email: 'admin@soeit.ac.in',
        enrollmentNo: 'AJU/ADMIN',
        password: 'Admin@123',
        role: 'admin',
        department: 'Other',
        universityId: defaultUni._id,
        isActive: true
      },
      {
        name: 'Master Control Admin',
        email: 'superadmin@soeit.ac.in',
        enrollmentNo: 'MASTER/001',
        password: 'SuperPassword@123',
        role: 'admin',
        department: 'Other',
        universityId: defaultUni._id,
        isActive: true
      }
    ];

    for (const user of demoUsers) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
        console.log(`👤 Demo ${user.role} created (${user.enrollmentNo})`);
      } else {
        // Update existing demo users
        exists.enrollmentNo = user.enrollmentNo;
        exists.role = user.role;
        exists.universityId = defaultUni._id;
        await exists.save();
        console.log(`🔄 Demo ${user.role} updated (${user.enrollmentNo})`);
      }
    }
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  }
};

const connectDB = async () => {
  try {
    // 1. Try connecting to the URI in .env if it exists
    let uri = process.env.MONGODB_URI;
    let connected = false;

    if (uri) {
      try {
        // Short timeout for the first attempt to local DB
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log(`✅ MongoDB Connected to: ${uri}`);
        connected = true;
      } catch (err) {
        console.log('⚠️  Local MongoDB not found, attempting in-memory database...');
      }
    }

    // 2. If not connected and we're in dev, use MongoMemoryServer
    if (!connected && process.env.NODE_ENV !== 'production') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      if (!mongoServer) {
        // Note: This might take a while on first run to download the binary
        mongoServer = await MongoMemoryServer.create({
          instance: { dbName: 'soeit_achievements' },
        });
      }
      uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('🗄️  In-memory MongoDB connected (Dev Mode)');
      connected = true;
    }

    if (!connected) {
      throw new Error('Could not connect to any MongoDB instance');
    }

    // 3. Seed demo data
    await seedDemoUsers();

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime error:', err.message);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) await mongoServer.stop();
    console.log('\n✅ DB shut down cleanly.');
  } catch (e) { }
  process.exit(0);
});

module.exports = connectDB;
