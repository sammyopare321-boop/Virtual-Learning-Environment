const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Please add a course code'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
  },
  // Extended fields from wizard
  category: { type: String, trim: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  startDate: { type: Date },
  endDate: { type: Date },
  enrollmentType: { type: String, enum: ['open', 'invite'], default: 'open' },
  maxStudents: { type: Number, default: 50 },
  gradingSystem: { type: String, enum: ['percentage', 'passfail'], default: 'percentage' },
  assignmentsEnabled: { type: Boolean, default: true },
  certificateEnabled: { type: Boolean, default: true },
  schedule: [{
    day: String,
    time: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
