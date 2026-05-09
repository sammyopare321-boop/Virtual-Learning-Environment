/**
 * Seed Script — Default Admin User
 * Run with: node src/utils/seedAdmin.js
 *
 * Default credentials:
 *   Email:    admin@university.edu
 *   Password: Admin@1234
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms';

const adminData = {
  name: 'System Administrator',
  email: 'admin@university.edu',
  password: 'Admin@1234',
  role: 'admin',
  status: 'active',
  department: 'Administration',
};

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${adminData.email}`);
      console.log('   No changes were made.');
      process.exit(0);
    }

    // Create admin — password is hashed automatically by the pre-save hook
    const admin = await User.create(adminData);
    console.log('\n🎉 Default Admin Created Successfully!');
    console.log('─────────────────────────────────────');
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Role:     ${admin.role}`);
    console.log('─────────────────────────────────────');
    console.log('   ⚠️  Change this password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedAdmin();
