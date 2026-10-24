const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [200, 'Note title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner reference is required']
      // Not indexed here; prefix of compound index { owner: 1, createdAt: -1 }
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required']
      // Not indexed here; prefix of compound index { course: 1, semester: 1, subject: 1 }
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      required: [true, 'Semester reference is required'],
      index: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required']
      // Not indexed here; prefix of compound index { subject: 1, lecture: 1 }
    },
    
    organizationType: {
      type: String,
      enum: {
        values: ['UNIT', 'GENERAL'],
        message: '{VALUE} is not a valid organization type'
      },
      default: 'GENERAL'
    },
    unitName: {
      type: String,
      trim: true,
      default: null
    },
    fileUrl: {
      type: String,
      required: [
        function () {
          return this.status !== 'DRAFT';
        },
        'File URL is required when note is not in DRAFT status'
      ],
      trim: true
    },
    fileName: {
      type: String,
      required: [
        function () {
          return this.status !== 'DRAFT';
        },
        'File name is required when note is not in DRAFT status'
      ],
      trim: true
    },
    fileType: {
      type: String,
      required: [
        function () {
          return this.status !== 'DRAFT';
        },
        'File type is required when note is not in DRAFT status'
      ],
      uppercase: true,
      enum: {
        values: ['PDF', 'DOC', 'DOCX', 'JPG', 'JPEG', 'PNG'],
        message: '{VALUE} is not a supported file type'
      }
    },
    fileSize: {
      type: Number,
      min: 0,
      default: null // In bytes
    },
    pageCount: {
      type: Number,
      min: 1,
      default: null
    },
    visibility: {
      type: String,
      enum: {
        values: ['PRIVATE', 'PUBLIC', 'ENROLLED'],
        message: '{VALUE} is not a valid visibility setting'
      },
      default: 'PRIVATE'
      // Not indexed here; prefix of compound index { visibility: 1, status: 1 }
    },
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'ARCHIVED'],
        message: '{VALUE} is not a valid note status'
      },
      default: 'PUBLISHED',
      index: true
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null
    },
    tags: {
      type: [String],
      default: []
    },
     
    language: {
      type: String,
      default: 'English',
      trim: true
    },
    views: {
      type: Number,
      min: 0,
      default: 0
    },
    downloads: {
      type: Number,
      min: 0,
      default: 0
    },
    saveCount: {
      type: Number,
      min: 0,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user reference is required']
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

// Strategic indexes for search, filtering, and student dashboard queries
noteSchema.index({ owner: 1, createdAt: -1 });
noteSchema.index({ course: 1, semester: 1, subject: 1 });
noteSchema.index({ visibility: 1, status: 1 });
noteSchema.index({ subject: 1, lecture: 1 });
noteSchema.index({ createdAt: -1 });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
