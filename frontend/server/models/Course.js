const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      maxlength: [150, 'Course name cannot exceed 150 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    courseType: {
      type: String,
      enum: {
        values: ['ACADEMIC', 'SKILL'],
        message: '{VALUE} is not a valid course type'
      },
      required: [true, 'Course type is required'],
      default: 'ACADEMIC'
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
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

// Query optimization index for catalog browsing and filtering
courseSchema.index({ courseType: 1, isPublished: 1, isActive: 1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
