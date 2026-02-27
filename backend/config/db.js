const mongoose = require('mongoose');

let mongoServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // In development, spin up an in-memory MongoDB automatically
    // so no local MongoDB installation is needed
    if (process.env.NODE_ENV !== 'production') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create({
          instance: { dbName: 'soeit_achievements' },
        });
        console.log('🗄️  In-memory MongoDB started (dev mode — no install required)');
      }
      uri = mongoServer.getUri();
    }

    // Fallback if MONGODB_URI is not set and not dev
    if (!uri) {
      uri = 'mongodb://localhost:27017/soeit_achievements';
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime error:', err.message);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Clean up on exit
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) await mongoServer.stop();
    console.log('\n✅ MongoDB shut down cleanly.');
  } catch (e) {
    // ignore
  }
  process.exit(0);
});

module.exports = connectDB;
