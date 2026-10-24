const mongoose = require('mongoose');

/**
 * Validates if a string is a valid MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  return (
    id &&
    mongoose.Types.ObjectId.isValid(id) &&
    new mongoose.Types.ObjectId(id).toString() === id.toString()
  );
};

/**
 * Generates a clean URL slug from text
 */
const slugify = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generates a collision-free slug for a Course
 */
const generateCourseSlug = async (name, CourseModel, excludeId = null) => {
  let baseSlug = slugify(name);
  if (!baseSlug) {
    baseSlug = 'course';
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const exists = await CourseModel.exists(query);
    if (!exists) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

/**
 * Generates a collision-free slug for a Subject scoped to a Semester
 */
const generateSubjectSlug = async (semesterId, name, SubjectModel, excludeId = null) => {
  let baseSlug = slugify(name);
  if (!baseSlug) {
    baseSlug = 'subject';
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { semester: semesterId, slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const exists = await SubjectModel.exists(query);
    if (!exists) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

/**
 * Parses and sanitizes pagination parameters
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' || query.sortOrder === '1' ? 1 : -1;

  return { page, limit, skip, sort: { [sortBy]: sortOrder } };
};

/**
 * Normalizes course name to detect variations (e.g. "B.Tech", "B Tech", "BTech", "B. Tech.")
 * without falsely merging distinct courses.
 */
const canonicalizeCourseName = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

module.exports = {
  isValidObjectId,
  slugify,
  canonicalizeCourseName,
  generateCourseSlug,
  generateSubjectSlug,
  parsePagination
};
