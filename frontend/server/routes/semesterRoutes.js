const express = require('express');
const router = express.Router({ mergeParams: true });
const subjectRoutes = require('./subjectRoutes');

const {
  createSemester,
  getSemestersByCourse,
  getSemesterById,
  updateSemester,
  deleteSemester
} = require('../controllers/semesterController');

const {
  authenticate,
} = require('../middleware/authMiddleware');

// Mount subjects nested under /api/semesters/:semesterId/subjects
router.use('/:semesterId/subjects', subjectRoutes);

// Nested under /api/courses/:courseId/semesters
router
  .route('/')
  .post(authenticate, createSemester)
  .get(authenticate, getSemestersByCourse);

// Direct /api/semesters/:id
router
  .route('/:id')
  .get(authenticate, getSemesterById)
  .patch(authenticate, updateSemester)
  .delete(authenticate, deleteSemester);

module.exports = router;
