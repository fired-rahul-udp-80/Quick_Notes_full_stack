const Course = require('../models/Course');
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
const CourseEnrollment = require('../models/NoteEnrollment');
const {
  isValidObjectId,
  slugify,
  canonicalizeCourseName,
  generateCourseSlug,
  parsePagination
} = require('../utils/validators');

const createCourse = async (req, res) => {
  try {
    const {
      name, 
      courseType,
      totalSemesters,
      isPublished
    } = req.body;

    // Validate required fields
    if (!name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course name is required'
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Course name cannot exceed 150 characters'
      });
    }

    // Validate courseType if provided
    const validCourseTypes = ['ACADEMIC', 'SKILL'];
    const resolvedCourseType = courseType ? courseType.toUpperCase() : 'ACADEMIC';
    if (!validCourseTypes.includes(resolvedCourseType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid course type. Allowed values are: ${validCourseTypes.join(', ')}`
      });
    }

    // Validate totalSemesters if provided
    let parsedSemesters = 0;
    if (totalSemesters !== undefined && totalSemesters !== null) {
      parsedSemesters = Number(totalSemesters);
      if (isNaN(parsedSemesters) || parsedSemesters < 0) {
        return res.status(400).json({
          success: false,
          message: 'Total semesters must be a non-negative number'
        });
      }
    }

    // Duplicate detection: check exact name (case-insensitive) or canonical abbreviation variation
    const canonical = canonicalizeCourseName(trimmedName);
    const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let existingCourse = await Course.findOne({
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') },
      courseType: resolvedCourseType,
      isActive: true
    });

    if (!existingCourse) {
      const candidates = await Course.find({
        courseType: resolvedCourseType,
        isActive: true
      }).select('_id name slug courseType isPublished isActive createdBy');

      for (const cand of candidates) {
        if (canonicalizeCourseName(cand.name) === canonical) {
          existingCourse = cand;
          break;
        }
      }
    }

    // Shared academic hierarchy rule: return existing record if already present
    if (existingCourse) {
      return res.status(200).json({
        success: true,
        message: 'Existing course found and selected',
        data: existingCourse
      });
    }

    // Generate collision-safe unique slug
    const slug = await generateCourseSlug(trimmedName, Course);

    // New student-created academic courses are immediately usable by other students
    const shouldPublish = typeof isPublished === 'boolean' ? isPublished : true;

    const userId = req.user.userId;

    // Create course record with strictly derived authenticated createdBy
    const course = await Course.create({
      name: trimmedName,
      slug,
      courseType: resolvedCourseType,
      isPublished: shouldPublish,
      isActive: true,
      createdBy: userId
    });

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);

    // Handle duplicate key error from MongoDB unique indexes / concurrent creates
    if (error.code === 11000) {
      try {
        const trimmed = req.body && req.body.name ? req.body.name.trim() : '';
        const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existing = await Course.findOne({
          name: { $regex: new RegExp(`^${escaped}$`, 'i') },
          isActive: true
        });
        if (existing) {
          return res.status(200).json({
            success: true,
            message: 'Existing course found and selected',
            data: existing
          });
        }
      } catch (findErr) {
        console.error('Error resolving duplicate course on concurrency:', findErr);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating course'
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const { page, limit, skip, sort } = parsePagination(req.query);
    const { courseType, search, q, all } = req.query;

    const filter = {
      isActive: true
    };

    if (req.query.publishedOnly === 'true') {
      filter.isPublished = true;
    }

    // Filter by course type
    if (courseType && ['ACADEMIC', 'SKILL'].includes(courseType.toUpperCase())) {
      filter.courseType = courseType.toUpperCase();
    }

    // Text search on name or courseCode
    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim()) {
      const sanitized = searchTerm.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { courseCode: { $regex: sanitized, $options: 'i' } }
      ];
    }

    const queryBuilder = Course.find(filter)
      .populate('createdBy', 'name email role')
      .sort(sort);

    if (all !== 'true') {
      queryBuilder.skip(skip).limit(limit);
    }

    const [courses, total] = await Promise.all([
      queryBuilder.lean(),
      Course.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      totalPages: all === 'true' ? 1 : Math.ceil(total / limit) || 1,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching courses'
    });
  }
};
 
const getMyCourses = async (req, res) => {
  try {
    const { page, limit, skip, sort } = parsePagination(req.query);
    const { courseType, search, q, includeArchived, all } = req.query;

    const currentUserId = req.user.userId;
    // Find all course IDs where current user has uploaded notes
    const studentNoteCourseIds = await Note.distinct('course', {
      owner: currentUserId,
      status: { $ne: 'ARCHIVED' }
    });

    const filter = {
      $or: [
        { createdBy: currentUserId },
        { _id: { $in: studentNoteCourseIds } }
      ]
    };

    if (includeArchived !== 'true') {
      filter.isActive = true;
    }

    if (courseType && ['ACADEMIC', 'SKILL'].includes(courseType.toUpperCase())) {
      filter.courseType = courseType.toUpperCase();
    }

    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim()) {
      const sanitized = searchTerm.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$and = [
        {
          $or: [
            { name: { $regex: sanitized, $options: 'i' } },
            { courseCode: { $regex: sanitized, $options: 'i' } }
          ]
        }
      ];
    }

    const queryBuilder = Course.find(filter).sort(sort);
    if (all !== 'true') {
      queryBuilder.skip(skip).limit(limit);
    }

    const [courses, total] = await Promise.all([
      queryBuilder.lean(),
      Course.countDocuments(filter)
    ]);

    // Attach real-time counts for semesters with user notes and personal notes count
    const coursesWithCounts = await Promise.all(
      courses.map(async (c) => {
        const [userSemesterIds, userNotesCount] = await Promise.all([
          Note.distinct('semester', {
            course: c._id,
            owner: currentUserId,
            status: { $ne: 'ARCHIVED' }
          }),
          Note.countDocuments({
            course: c._id,
            owner: currentUserId,
            status: { $ne: 'ARCHIVED' }
          })
        ]);
        return {
          ...c,
          semestersCount: userSemesterIds.length,
          noteCount: userNotesCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: coursesWithCounts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: coursesWithCounts
    });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching your courses'
    });
  }
};

 
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    let query;
    if (isValidObjectId(id)) {
      query = { _id: id };
    } else {
      query = { slug: id.toLowerCase().trim() };
    }

    const course = await Course.findOne(query).populate('createdBy', 'name email role');
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Privacy guard: if unpublished, only owner or ADMIN can view
    const currentUserId = req.user ?req.user.userId : null;
    const isOwner = currentUserId && course.createdBy && course.createdBy._id.toString() === currentUserId.toString();
    const isAdmin = req.user && req.user.role === 'ADMIN';

    if (!course.isPublished && !isOwner && !isAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Calculate safe related counts
    const [semesterCount, subjectCount, publishedNotesCount] = await Promise.all([
      Semester.countDocuments({ course: course._id, isActive: true }),
      Subject.countDocuments({ course: course._id, isActive: true }),
      isOwner || isAdmin
        ? Note.countDocuments({ course: course._id })
        : Note.countDocuments({ course: course._id, status: 'PUBLISHED', visibility: 'PUBLIC' })
    ]);

    const courseData = course.toObject();
    courseData.semesterCount = semesterCount;
    courseData.subjectCount = subjectCount;
    courseData.noteCount = publishedNotesCount;

    return res.status(200).json({
      success: true,
      data: courseData
    });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching course details'
    });
  }
};

 
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    const course = await Course.findById(id);
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Ownership verification
    const currentUserId =  req.user.userId;
    const isOwner = course.createdBy.toString() === currentUserId.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this course'
      });
    }

    const {
      name,
      courseType,
      totalSemesters,
      isPublished,
      isActive
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Course name cannot be empty'
        });
      }
      if (name.trim().length > 150) {
        return res.status(400).json({
          success: false,
          message: 'Course name cannot exceed 150 characters'
        });
      }
      if (name.trim() !== course.name) {
        course.name = name.trim();
        course.slug = await generateCourseSlug(name.trim(), Course, course._id);
      }
    }

    if (courseType !== undefined) {
      const upper = courseType.toUpperCase();
      if (!['ACADEMIC', 'SKILL'].includes(upper)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid course type'
        });
      }
      course.courseType = upper;
    }
    if (totalSemesters !== undefined) {
      const parsed = Number(totalSemesters);
      if (isNaN(parsed) || parsed < 0) {
        return res.status(400).json({
          success: false,
          message: 'Total semesters must be a non-negative number'
        });
      }
      course.totalSemesters = parsed;
    }

    if (typeof isPublished === 'boolean') {
      course.isPublished = isPublished;
    }

    if (typeof isActive === 'boolean') {
      course.isActive = isActive;
    }

    course.updatedBy = req.user.userId;
    await course.save();

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating course'
    });
  }
};

 
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Ownership check
    const currentUserId = req.user.userId;
    const isOwner = course.createdBy.toString() === currentUserId.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this course'
      });
    }

    // Check if notes exist under this course
    const noteCount = await Note.countDocuments({ course: course._id });

    // If hard delete requested
    if (req.query.hard === 'true') {
      if (noteCount > 0) {
        // Refuse hard delete to protect notes
        course.isActive = false;
        course.isPublished = false;
        await course.save();

        return res.status(400).json({
          success: false,
          message: `Cannot permanently delete course because ${noteCount} note(s) exist. The course has been safely archived instead.`
        });
      }

      // Safe to hard delete related semesters, subjects, lectures and the course
      await Course.findByIdAndDelete(course._id);
      return res.status(200).json({
        success: true,
        message: 'Course permanently deleted successfully'
      });
    }

    // Default safe soft delete / archive
    course.isActive = false;
    course.isPublished = false;
    course.updatedBy =  req.user.userId;
    await course.save();

    return res.status(200).json({
      success: true,
      message: 'Course archived successfully',
      data: course
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting course'
    });
  }
};

/**
 * @desc    Enroll the logged-in student in an active course
 * @route   POST /api/courses/:id/enroll
 * @access  Private (Authenticated User)
 */
 

module.exports = {
  createCourse,
  getCourses,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
