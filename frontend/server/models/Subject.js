const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      required: [true, 'Semester reference is required']
      // Not indexed here; prefix of compound unique index { semester: 1, slug: 1 }
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required']
      // Not indexed here; prefix of compound query index { course: 1, semester: 1 }
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Subject slug is required'],
      lowercase: true,
      trim: true
    },
    subjectCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    lectureCount: {
      type: Number,
      min: 0,
      default: 0
    },
    noteCount: {
      type: Number,
      min: 0,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index: prevents duplicate subject slugs within the same semester
subjectSchema.index({ semester: 1, slug: 1 }, { unique: true });

// Compound query index for fast course + semester subject lookups
subjectSchema.index({ course: 1, semester: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
