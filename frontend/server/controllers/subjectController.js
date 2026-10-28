const Subject = require('../models/Subject');
const Semester = require('../models/Semester');
const Course = require('../models/Course');
const Note = require('../models/Note');
const {
  isValidObjectId,
  slugify,
  generateSubjectSlug,
  parsePagination
} = require('../utils/validators');

const createSubject = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { name, subjectCode, course: clientCourseId } = req.body;

    if (!isValidObjectId(semesterId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester ID format'
      });
    }

    const semester = await Semester.findById(semesterId).populate('course');
    if (!semester || !semester.isActive || !semester.course || !semester.course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Parent semester or course not found or inactive'
      });
    }

    // Server-side hierarchy validation: if client supplied course, verify it matches semester's course
    if (clientCourseId && isValidObjectId(clientCourseId)) {
      if (semester.course._id.toString() !== clientCourseId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'The semester does not belong to the selected course'
        });
      }
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Subject name is required'
      });
    }

    const trimmedName = name.trim();
    const baseSlug = slugify(trimmedName) || 'subject';

    // Duplicate prevention and reuse: check if subject exists within this semester
    const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingSubject = await Subject.findOne({
      semester: semester._id,
      $or: [
        { slug: baseSlug },
        { name: { $regex: new RegExp(`^${escapedName}$`, 'i') } }
      ],
      isActive: true
    });

    if (existingSubject) {
      return res.status(200).json({
        success: true,
        message: 'Existing subject found and selected',
        data: existingSubject
      });
    }

    // Generate collision-safe slug scoped to this semester
    const slug = await generateSubjectSlug(semester._id, trimmedName, Subject);

    const userId = req.user.userId;

    const subject = await Subject.create({
      semester: semester._id,
      course: semester.course._id,
      name: trimmedName,
      slug,
      subjectCode: subjectCode ? subjectCode.trim().toUpperCase() : null,
      isActive: true,
      createdBy: userId
    });

    // Safely increment semester's subjectCount
    await Semester.findByIdAndUpdate(semester._id, { $inc: { subjectCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    if (error.code === 11000) {
      try {
        const trimmed = req.body && req.body.name ? req.body.name.trim() : '';
        const base = slugify(trimmed);
        const existing = await Subject.findOne({
          semester: req.params.semesterId,
          $or: [
            { slug: base },
            { name: { $regex: new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
          ],
          isActive: true
        });
        if (existing) {
          return res.status(200).json({
            success: true,
            message: 'Existing subject found and selected',
            data: existing
          });
        }
      } catch (findErr) {
        console.error('Error resolving duplicate subject:', findErr);
      }
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating subject'
    });
  }
};

const getSubjectsBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { page, limit, skip, sort } = parsePagination(req.query);
    const { search, q, course: courseQuery } = req.query;

    if (!isValidObjectId(semesterId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester ID format'
      });
    }

    const semester = await Semester.findById(semesterId).populate('course');
    if (!semester || !semester.isActive || !semester.course || !semester.course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    // Validate course filter against hierarchy if supplied
    if (courseQuery && isValidObjectId(courseQuery)) {
      if (semester.course._id.toString() !== courseQuery.toString()) {
        return res.status(400).json({
          success: false,
          message: 'The semester does not belong to the requested course'
        });
      }
    }

    // Privacy guard and ownership check
    const currentUserId = req.user ? (req.user.userId || req.user._id) : null;
    const isOwner = Boolean(
      currentUserId &&
      semester.course?.createdBy &&
      semester.course.createdBy.toString() === currentUserId.toString()
    );
    const isAdmin = Boolean(req.user && req.user.role === 'ADMIN');

    const filter = {
      semester: semesterId,
      isActive: true
    };

    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim()) {
      const sanitized = searchTerm.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { subjectCode: { $regex: sanitized, $options: 'i' } }
      ];
    }

    const [subjects, total] = await Promise.all([
      Subject.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Subject.countDocuments(filter)
    ]);

    const subjectsWithCounts = await Promise.all(
      subjects.map(async (subj) => {
        // Count all active/non-archived notes uploaded across ALL students for this subject
        const totalNoteCount = await Note.countDocuments({
          subject: subj._id,
          status: { $ne: 'ARCHIVED' }
        });

        let myNoteCount = 0;
        let myPublicCount = 0;
        let myPrivateCount = 0;

        if (currentUserId) {
          [myNoteCount, myPublicCount, myPrivateCount] = await Promise.all([
            Note.countDocuments({
              subject: subj._id,
              owner: currentUserId,
              status: { $ne: 'ARCHIVED' }
            }),
            Note.countDocuments({
              subject: subj._id,
              owner: currentUserId,
              status: { $ne: 'ARCHIVED' },
              visibility: 'PUBLIC'
            }),
            Note.countDocuments({
              subject: subj._id,
              owner: currentUserId,
              status: { $ne: 'ARCHIVED' },
              visibility: 'PRIVATE'
            })
          ]);
        } else {
          myPublicCount = totalNoteCount;
        }

        return {
          ...subj,
          totalNoteCount, // Exact count of notes uploaded by ANY student
          noteCount: myNoteCount, // Count for the requesting student (for personal study filters)
          myNoteCount,
          publicCount: myPublicCount,
          privateCount: myPrivateCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: subjectsWithCounts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: subjectsWithCounts
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching subjects'
    });
  }
};

 
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID format'
      });
    }

    const subject = await Subject.findById(id)
      .populate('semester', 'name semesterNumber isActive')
      .populate('course', 'name slug isPublished isActive createdBy');

    if (!subject || !subject.isActive || !subject.course || !subject.course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Privacy check
    const currentUserId = req.user ? (req.user.userId) : null;
    const isOwner = currentUserId && subject.course.createdBy.toString() === currentUserId.toString();
    const isAdmin = req.user && req.user.role === 'ADMIN';

    if (!subject.course.isPublished && !isOwner && !isAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    const noteCount = await (isOwner || isAdmin
      ? Note.countDocuments({ subject: subject._id })
      : Note.countDocuments({ subject: subject._id, status: 'PUBLISHED', visibility: 'PUBLIC' }));

    const data = subject.toObject();
    data.noteCount = noteCount;

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching subject by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching subject details'
    });
  }
};

 
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID format'
      });
    }

    const subject = await Subject.findById(id).populate('course');
    if (!subject || !subject.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Ownership check
    const currentUserId = req.user.userId;
    const isOwner =
      (subject.createdBy && subject.createdBy.toString() === currentUserId.toString()) ||
      (subject.course && subject.course.createdBy && subject.course.createdBy.toString() === currentUserId.toString());
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this subject'
      });
    }

    // Restriction: Cannot edit subject if notes are already uploaded
    const noteCount = await Note.countDocuments({
      subject: subject._id,
      status: { $ne: 'ARCHIVED' }
    });

    if (noteCount > 0 && !isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit subject because notes are already uploaded to it'
      });
    }

    const { name, subjectCode, isActive } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Subject name cannot be empty'
        });
      }
      if (name.trim() !== subject.name) {
        subject.name = name.trim();
        subject.slug = await generateSubjectSlug(subject.semester, name.trim(), Subject, subject._id);
      }
    }

    if (subjectCode !== undefined) {
      subject.subjectCode = subjectCode ? subjectCode.trim().toUpperCase() : null;
    }

    if (typeof isActive === 'boolean') {
      subject.isActive = isActive;
    }

    subject.updatedBy = req.user.userId;
    await subject.save();

    return res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating subject'
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID format'
      });
    }

    const subject = await Subject.findById(id).populate('course');
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Ownership check
    const currentUserId = req.user.userId;
    const isOwner = subject.course.createdBy.toString() === currentUserId.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this subject'
      });
    }

    // Check notes
    const noteCount = await Note.countDocuments({ subject: subject._id });

    if (req.query.hard === 'true') {
      if (noteCount > 0) {
        subject.isActive = false;
        await subject.save();

        return res.status(400).json({
          success: false,
          message: `Cannot permanently delete subject because ${noteCount} note(s) exist. The subject has been safely archived instead.`
        });
      }

      await Subject.findByIdAndDelete(subject._id);
      await Semester.findByIdAndUpdate(subject.semester, { $inc: { subjectCount: -1 } });

      return res.status(200).json({
        success: true,
        message: 'Subject permanently deleted successfully'
      });
    }

    subject.isActive = false;
    subject.updatedBy = req.user.userId;
    await subject.save();

    return res.status(200).json({
      success: true,
      message: 'Subject archived successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting subject'
    });
  }
};

module.exports = {
  createSubject,
  getSubjectsBySemester,
  getSubjectById,
  updateSubject,
  deleteSubject
};
