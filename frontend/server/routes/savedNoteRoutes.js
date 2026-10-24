const express = require('express');
const router = express.Router();

const {
  saveNote,
  getSavedNotes,
  removeSavedNote,
  checkNoteSaved
} = require('../controllers/savedNoteController');

const { authenticate } = require('../middleware/authMiddleware');

// All saved note routes require authentication
router.use(authenticate);

// Get list of saved notes
router.get('/', getSavedNotes);

// Check if specific note is saved (before :noteId parameter routes)
router.get('/:noteId/check', checkNoteSaved);

// Bookmark or unbookmark note by noteId
router
  .route('/:noteId')
  .post(saveNote)
  .delete(removeSavedNote);

module.exports = router;
