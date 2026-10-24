const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  createSubject,
  getSubjectsBySemester,
  getSubjectById,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');

const {
  authenticate,
} = require('../middleware/authMiddleware');

// Nested under /api/semesters/:semesterId/subjects
router
  .route('/')
  .post(authenticate, createSubject)
  .get(authenticate, getSubjectsBySemester);

// Direct /api/subjects/:id
router
  .route('/:id')
  .get(authenticate, getSubjectById)
  .patch(authenticate, updateSubject)
  .delete(authenticate, deleteSubject);

module.exports = router;
