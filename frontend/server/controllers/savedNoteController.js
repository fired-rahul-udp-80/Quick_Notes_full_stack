const SavedNote = require('../models/SavedNote');
const Note = require('../models/Note');
const { isValidObjectId, parsePagination } = require('../utils/validators');
 
const saveNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    const note = await Note.findById(noteId);
    if (!note || note.status === 'ARCHIVED') {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unavailable'
      });
    }

    const currentUserId = req.user.userId;
    const isOwner = note.owner.toString() === currentUserId.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (note.visibility === 'PRIVATE' && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Cannot bookmark a private note'
      });
    }

    if (note.status !== 'PUBLISHED' && !isOwner && !isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Note is not currently available for saving'
      });
    }

    // Check if already saved
    const existingBookmark = await SavedNote.findOne({
      student: currentUserId,
      note: note._id
    });

    if (existingBookmark) {
      return res.status(200).json({
        success: true,
        message: 'Note already saved',
        isSaved: true,
        data: existingBookmark
      });
    }

    let savedNote;
    try {
      savedNote = await SavedNote.create({
        student: currentUserId,
        note: note._id
      });
    } catch (createError) {
      if (createError.code === 11000) {
        // Handle race condition on duplicate compound index
        const existing = await SavedNote.findOne({
          student: currentUserId,
          note: note._id
        });
        return res.status(200).json({
          success: true,
          message: 'Note already saved',
          isSaved: true,
          data: existing
        });
      }
      throw createError;
    }

    // Atomically increment saveCount on Note
    await Note.findByIdAndUpdate(note._id, { $inc: { saveCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'Note saved successfully',
      isSaved: true,
      data: savedNote
    });
  } catch (error) {
    console.error('Error saving note:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error saving note'
    });
  }
};

 
const getSavedNotes = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const currentUserId = req.user.userId;
    const filter = {
      student: currentUserId
    };

    const [savedNotes, total] = await Promise.all([
      SavedNote.find(filter)
        .sort({ savedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'note',
          select:
            'title description owner course semester subject lecture fileType fileUrl visibility status createdAt pageCount',
          populate: [
            { path: 'owner', select: 'name' },
            { path: 'course', select: 'name slug courseCode isPublished' },
            { path: 'semester', select: 'name semesterNumber' },
            { path: 'subject', select: 'name slug subjectCode' },
          ]
        })
        .lean(),
      SavedNote.countDocuments(filter)
    ]);

    // Filter out notes that have been deleted, archived, or made private by other owners
    const currentUserIdStr = currentUserId.toString();
    const isAdmin = req.user.role === 'ADMIN';

    const accessibleBookmarks = savedNotes.filter((item) => {
      const n = item.note;
      if (!n || n.status === 'ARCHIVED') return false;
      const isOwner = n.owner && n.owner._id ? n.owner._id.toString() === currentUserIdStr : false;
      if (n.visibility === 'PRIVATE' && !isOwner && !isAdmin) return false;
      return true;
    });

    return res.status(200).json({
      success: true,
      count: accessibleBookmarks.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: accessibleBookmarks
    });
  } catch (error) {
    console.error('Error fetching saved notes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching saved notes'
    });
  }
};

 
const removeSavedNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    const currentUserId = req.user.userId;
    const deleted = await SavedNote.findOneAndDelete({
      student: currentUserId,
      note: noteId
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Saved note bookmark not found'
      });
    }

    // Atomically decrement saveCount and ensure non-negative
    await Note.findByIdAndUpdate(noteId, { $inc: { saveCount: -1 } });
    await Note.updateOne(
      { _id: noteId, saveCount: { $lt: 0 } },
      { $set: { saveCount: 0 } }
    );

    return res.status(200).json({
      success: true,
      message: 'Note bookmark removed successfully',
      isSaved: false
    });
  } catch (error) {
    console.error('Error removing saved note:', error);
    return res.status(500).json({
      success: false,
      message: 'Error removing saved note'
    });
  }
};

/**
 * @desc    Check if a note is bookmarked by the authenticated user
 * @route   GET /api/saved-notes/:noteId/check
 * @access  Private (Authenticated User)
 */
const checkNoteSaved = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    const currentUserId = req.user.userId;
    const exists = await SavedNote.exists({
      student: currentUserId,
      note: noteId
    });

    return res.status(200).json({
      success: true,
      data: {
        isSaved: Boolean(exists)
      }
    });
  } catch (error) {
    console.error('Error checking saved note status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking bookmark status'
    });
  }
};

module.exports = {
  saveNote,
  getSavedNotes,
  removeSavedNote,
  checkNoteSaved
};
