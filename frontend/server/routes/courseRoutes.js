const express = require('express');
const router = express.Router();
const semesterRoutes = require('./semesterRoutes');

const {
  createCourse,
  getCourses,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

const {
  authenticate,
} = require('../middleware/authMiddleware');

// Mount semesters nested under /api/courses/:courseId/semesters
router.use('/:courseId/semesters', semesterRoutes);

// Base course routes
router
  .route('/')
  .post(authenticate, createCourse)
  .get(authenticate, getCourses);

// Current user's created courses (must come before /:id)
router.get('/my', authenticate, getMyCourses);

// Specific course by ID or slug
router
  .route('/:id')
  .get(authenticate, getCourseById)
  .patch(authenticate, updateCourse)
  .delete(authenticate, deleteCourse);

module.exports = router;
