const Meeting = require('../models/Meeting');

// Create a new meeting room
const createMeeting = async (req, res) => {
  try {
    const { title, description, courseName, subjectName, isPrivate, passcode, maxParticipants } = req.body;
    const userId = req.user?.userId;
    const userName = req.user?.name || 'Anonymous Student';

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Meeting title is required'
      });
    }

    // Generate a unique room code
    let roomCode = Meeting.generateRoomCode();
    let codeExists = await Meeting.findOne({ roomCode });
    let attempts = 0;
    while (codeExists && attempts < 5) {
      roomCode = Meeting.generateRoomCode();
      codeExists = await Meeting.findOne({ roomCode });
      attempts++;
    }

    const meeting = new Meeting({
      title: title.trim(),
      description: description ? description.trim() : '',
      roomCode,
      host: userId,
      hostName: userName,
      courseName: courseName ? courseName.trim() : (req.user?.academicProfile?.courseName || ''),
      subjectName: subjectName ? subjectName.trim() : '',
      isPrivate: Boolean(isPrivate),
      passcode: passcode && passcode.trim() ? passcode.trim() : null,
      maxParticipants: maxParticipants ? Number(maxParticipants) : 8,
      status: 'ACTIVE',
      startedAt: new Date(),
      participants: [
        {
          user: userId,
          name: userName,
          joinedAt: new Date()
        }
      ]
    });

    await meeting.save();

    return res.status(201).json({
      success: true,
      message: 'Meeting room created successfully',
      data: {
        meeting: {
          id: meeting._id,
          _id: meeting._id,
          title: meeting.title,
          description: meeting.description,
          roomCode: meeting.roomCode,
          host: meeting.host,
          hostName: meeting.hostName,
          courseName: meeting.courseName,
          subjectName: meeting.subjectName,
          isPrivate: meeting.isPrivate,
          hasPasscode: !!meeting.passcode,
          maxParticipants: meeting.maxParticipants,
          status: meeting.status,
          startedAt: meeting.startedAt
        }
      }
    });
  } catch (error) {
    console.error('Error in createMeeting:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create meeting room'
    });
  }
};

// Get meeting by room code or ID
const getMeetingByCode = async (req, res) => {
  try {
    const rawCode = req.params.roomCode;
    if (!rawCode) {
      return res.status(400).json({
        success: false,
        message: 'Room code is required'
      });
    }

    const normalizedCode = rawCode.trim().toUpperCase();

    // Find by roomCode or by ObjectId
    const query = normalizedCode.includes('-')
      ? { roomCode: normalizedCode }
      : {
          $or: [
            { roomCode: normalizedCode },
            ...(normalizedCode.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: normalizedCode }] : [])
          ]
        };

    const meeting = await Meeting.findOne(query);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting room not found or invalid room code'
      });
    }

    if (meeting.status === 'ENDED') {
      return res.status(410).json({
        success: false,
        message: 'This meeting has ended',
        data: {
          status: 'ENDED',
          endedAt: meeting.endedAt
        }
      });
    }

    const currentUserId = req.user?.userId ? String(req.user.userId) : null;
    const isHost = currentUserId && String(meeting.host) === currentUserId;

    return res.status(200).json({
      success: true,
      data: {
        meeting: {
          id: meeting._id,
          _id: meeting._id,
          title: meeting.title,
          description: meeting.description,
          roomCode: meeting.roomCode,
          host: meeting.host,
          hostName: meeting.hostName,
          isHost,
          courseName: meeting.courseName,
          subjectName: meeting.subjectName,
          isPrivate: meeting.isPrivate,
          hasPasscode: !!meeting.passcode,
          maxParticipants: meeting.maxParticipants,
          status: meeting.status,
          startedAt: meeting.startedAt,
          participantCount: meeting.participants.filter(p => !p.leftAt).length
        }
      }
    });
  } catch (error) {
    console.error('Error in getMeetingByCode:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve meeting details'
    });
  }
};

// Verify meeting passcode
const verifyMeetingPasscode = async (req, res) => {
  try {
    const { roomCode, passcode } = req.body;
    if (!roomCode || !passcode) {
      return res.status(400).json({
        success: false,
        message: 'Room code and passcode are required'
      });
    }

    const normalizedCode = roomCode.trim().toUpperCase();
    const meeting = await Meeting.findOne({ roomCode: normalizedCode, status: 'ACTIVE' });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    if (!meeting.passcode || meeting.passcode === passcode.trim()) {
      return res.status(200).json({
        success: true,
        message: 'Passcode verified successfully'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Incorrect passcode'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying passcode'
    });
  }
};

// List all active public study rooms
const getActiveMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      status: 'ACTIVE',
      isPrivate: false
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const formatted = meetings.map((m) => ({
      id: m._id,
      _id: m._id,
      title: m.title,
      description: m.description,
      roomCode: m.roomCode,
      hostName: m.hostName,
      courseName: m.courseName,
      subjectName: m.subjectName,
      hasPasscode: !!m.passcode,
      maxParticipants: m.maxParticipants,
      startedAt: m.startedAt,
      createdAt: m.createdAt
    }));

    return res.status(200).json({
      success: true,
      data: {
        meetings: formatted
      }
    });
  } catch (error) {
    console.error('Error fetching active meetings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch active study rooms'
    });
  }
};

// End a meeting (Host only)
const endMeeting = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const normalizedCode = roomCode.trim().toUpperCase();
    const meeting = await Meeting.findOne({ roomCode: normalizedCode });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Only host or ADMIN can end
    if (String(meeting.host) !== String(userId) && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only the meeting host can end the meeting'
      });
    }

    meeting.status = 'ENDED';
    meeting.endedAt = new Date();
    await meeting.save();

    return res.status(200).json({
      success: true,
      message: 'Meeting ended successfully'
    });
  } catch (error) {
    console.error('Error in endMeeting:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to end meeting'
    });
  }
};

module.exports = {
  createMeeting,
  getMeetingByCode,
  verifyMeetingPasscode,
  getActiveMeetings,
  endMeeting
};
