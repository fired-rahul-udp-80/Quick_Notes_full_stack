const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required']
      // Not indexed here; prefix of compound unique index { course: 1, semesterNumber: 1 }
    },
    name: {
      type: String,
      required: [true, 'Semester name is required'],
      trim: true
    },
    semesterNumber: {
      type: Number,
      required: [true, 'Semester number is required'],
      min: [1, 'Semester number must be at least 1'],
      max: [12, 'Semester number cannot exceed 12']
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    subjectCount: {
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

// Compound unique index: prevents duplicate Semester numbers within the same Course
semesterSchema.index({ course: 1, semesterNumber: 1 }, { unique: true });

const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;
