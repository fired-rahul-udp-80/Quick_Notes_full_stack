const Semester = require('../models/Semester');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
const { isValidObjectId } = require('../utils/validators');

const createSemester = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, semesterNumber} = req.body;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Parent course not found or inactive'
      });
    }

    // Ownership verification - Course owner, admin, or authenticated user contributing to active course
    const isOwner = course.createdBy && course.createdBy.toString() === req.user.userId.toString();
    const isAdmin = req.user.role === 'ADMIN';

    // Validate semester number
    const num = Number(semesterNumber);
    if (!num || isNaN(num) || num < 1 || num > 12) {
      return res.status(400).json({
        success: false,
        message: 'Semester number must be an integer between 1 and 12'
      });
    }

    // Check if this semesterNumber already exists in this course
    const existingSemester = await Semester.findOne({
      course: courseId,
      semesterNumber: num,
      isActive: true
    });

    if (existingSemester) {
      return res.status(200).json({
        success: true,
        message: 'Existing semester found and selected',
        data: existingSemester
      });
    }

    const semesterName = name && name.trim() ? name.trim() : `Semester ${num}`;
    const userId = req.user.userId;

    const semester = await Semester.create({
      course: courseId,
      name: semesterName,
      semesterNumber: num,
      isActive: true,
      createdBy: userId
    });

    return res.status(201).json({
      success: true,
      message: 'Semester created successfully',
      data: semester
    });
  } catch (error) {
    console.error('Error creating semester:', error);
    if (error.code === 11000) {
      const existing = await Semester.findOne({
        course: req.params.courseId,
        semesterNumber: Number(req.body.semesterNumber)
      });
      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'Existing semester found and selected',
          data: existing
        });
      }
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating semester'
    });
  }
};

const getSemestersByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Privacy guard
    const currentUserId = req.user ? (req.user.userId) : null;
    const isOwner = currentUserId && course.createdBy && course.createdBy.toString() === currentUserId.toString();
    const isAdmin = req.user && req.user.role === 'ADMIN';

    const semesters = await Semester.find({
      course: courseId,
      isActive: true
    })
      .populate('createdBy', 'name email role')
      .sort({ semesterNumber: 1 })
      .lean();

    // Populate dynamic subject counts and user-specific note counts
    const semestersWithCounts = await Promise.all(
      semesters.map(async (sem) => {
        const [subjectCount, myNoteCount, publicNoteCount, privateNoteCount] = await Promise.all([
          Subject.countDocuments({ semester: sem._id, isActive: true }),
          currentUserId
            ? Note.countDocuments({
                semester: sem._id,
                owner: currentUserId,
                status: { $ne: 'ARCHIVED' }
              })
            : 0,
          currentUserId
            ? Note.countDocuments({
                semester: sem._id,
                owner: currentUserId,
                status: { $ne: 'ARCHIVED' },
                visibility: 'PUBLIC'
              })
            : 0,
          currentUserId
            ? Note.countDocuments({
                semester: sem._id,
                owner: currentUserId,
                status: { $ne: 'ARCHIVED' },
                visibility: 'PRIVATE'
              })
            : 0
        ]);

        return {
          ...sem,
          subjectCount,
          noteCount: myNoteCount,
          myNoteCount,
          publicNoteCount,
          privateNoteCount
        };
      })
    );

    let resultSemesters = semestersWithCounts;
    if (req.query.onlyWithMyNotes === 'true' || req.query.onlyWithNotes === 'true') {
      resultSemesters = resultSemesters.filter((s) => s.noteCount > 0);
    }

    return res.status(200).json({
      success: true,
      count: resultSemesters.length,
      data: resultSemesters
    });
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching semesters'
    });
  }
};

 
const getSemesterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester ID format'
      });
    }

    const semester = await Semester.findById(id).populate('course', 'name slug isPublished isActive createdBy');
    if (!semester || !semester.isActive || !semester.course || !semester.course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    // Privacy check
    const currentUserId = req.user ? (req.user.userId) : null;
    const isOwner = currentUserId && semester.course.createdBy && semester.course.createdBy.toString() === currentUserId.toString();
    const isAdmin = req.user && req.user.role === 'ADMIN';

    if (!semester.course.isPublished && !isOwner && !isAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    const [subjectCount, noteCount] = await Promise.all([
      Subject.countDocuments({ semester: semester._id, isActive: true }),
      isOwner || isAdmin
        ? Note.countDocuments({ semester: semester._id })
        : Note.countDocuments({ semester: semester._id, status: 'PUBLISHED', visibility: 'PUBLIC' })
    ]);

    const data = semester.toObject();
    data.subjectCount = subjectCount;
    data.noteCount = noteCount;

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching semester by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching semester'
    });
  }
};

 
const updateSemester = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester ID format'
      });
    }

    const semester = await Semester.findById(id).populate('course');
    if (!semester || !semester.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    // Ownership check
    const currentUserId = req.user.userId;
    const isOwner = semester.course.createdBy && semester.course.createdBy.toString() === currentUserId.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this semester'
      });
    }

    const { name, semesterNumber, isActive } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Semester name cannot be empty'
        });
      }
      semester.name = name.trim();
    }

    if (semesterNumber !== undefined) {
      const num = Number(semesterNumber);
      if (isNaN(num) || num < 1 || num > 12) {
        return res.status(400).json({
          success: false,
          message: 'Semester number must be an integer between 1 and 12'
        });
      }

      if (num !== semester.semesterNumber) {
        const conflict = await Semester.findOne({
          course: semester.course._id,
          semesterNumber: num,
          _id: { $ne: semester._id },
          isActive: true
        });

        if (conflict) {
          return res.status(400).json({
            success: false,
            message: `Semester ${num} already exists in this course`
          });
        }
        semester.semesterNumber = num;
      }
    }

    if (typeof isActive === 'boolean') {
      semester.isActive = isActive;
    }

    semester.updatedBy =req.user.userId;
    await semester.save();

    return res.status(200).json({
      success: true,
      message: 'Semester updated successfully',
      data: semester
    });
  } catch (error) {
    console.error('Error updating semester:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating semester'
    });
  }
};

 
const deleteSemester = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester ID format'
      });
    }

    const semester = await Semester.findById(id).populate('course');
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    // Ownership check
    const currentUserId = req.user.userId;
    const isOwner = semester.course.createdBy && semester.course.createdBy.toString() === currentUserId.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this semester'
      });
    }

    // Check notes
    const noteCount = await Note.countDocuments({ semester: semester._id });

    if (req.query.hard === 'true') {
      if (noteCount > 0) {
        semester.isActive = false;
        await semester.save();

        return res.status(400).json({
          success: false,
          message: `Cannot permanently delete semester because ${noteCount} note(s) exist. The semester has been safely archived instead.`
        });
      }

      await Semester.findByIdAndDelete(semester._id);
      return res.status(200).json({
        success: true,
        message: 'Semester permanently deleted successfully'
      });
    }

    semester.isActive = false;
    semester.updatedBy = req.user.userId;
    await semester.save();

    return res.status(200).json({
      success: true,
      message: 'Semester archived successfully',
      data: semester
    });
  } catch (error) {
    console.error('Error deleting semester:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting semester'
    });
  }
};

module.exports = {
  createSemester,
  getSemestersByCourse,
  getSemesterById,
  updateSemester,
  deleteSemester
};
