const mongoose = require('mongoose');

const noteEnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required']
      // Not indexed here; prefix of compound unique index { student: 1, course: 1 }
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: [true, 'Note reference is required'],
      index: true
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: {
        values: ['ACTIVE', 'CANCELLED', 'COMPLETED', 'DROPPED'],
        message: '{VALUE} is not a valid enrollment status'
      },
      default: 'ACTIVE'
    },
    progress: {
      type: Number,
      min: [0, 'Progress cannot be less than 0'],
      max: [100, 'Progress cannot exceed 100'],
      default: 0
    },
    lastAccessedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index: a student cannot have duplicate enrollment records for the same course
noteEnrollmentSchema.index({ student: 1, note: 1 }, { unique: true });

module.exports = mongoose.model('NoteEnrollment', noteEnrollmentSchema);
