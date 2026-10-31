const express = require('express');
const router = express.Router();
const {
  createMeeting,
  getMeetingByCode,
  verifyMeetingPasscode,
  getActiveMeetings,
  endMeeting
} = require('../controllers/meetingController');
const { authenticate } = require('../middleware/authMiddleware');

// All meeting routes require authentication
router.post('/create', authenticate, createMeeting);
router.get('/active', authenticate, getActiveMeetings);
router.get('/room/:roomCode', authenticate, getMeetingByCode);
router.post('/verify-passcode', authenticate, verifyMeetingPasscode);
router.patch('/room/:roomCode/end', authenticate, endMeeting);

module.exports = router;
