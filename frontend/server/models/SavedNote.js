const mongoose = require('mongoose');

const savedNoteSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required']
      // Not indexed here; prefix of compound unique index { student: 1, note: 1 }
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: [true, 'Note reference is required'],
      index: true
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index: a student cannot bookmark/save the same note twice
savedNoteSchema.index({ student: 1, note: 1 }, { unique: true });

const SavedNote = mongoose.model('SavedNote', savedNoteSchema);

module.exports = SavedNote;
