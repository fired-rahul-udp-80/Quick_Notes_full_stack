/**
 * Comprehensive Backend Academic Hierarchy & Note Sharing Test Suite
 * Tests all 12 business requirements using isolated unit tests & mocked Mongoose layers.
 * Does NOT connect to or mutate live database data.
 */

const assert = require('assert');
const mongoose = require('mongoose');

// Models
const Course = require('./models/Course');
const Semester = require('./models/Semester');
const Subject = require('./models/Subject');
const Lecture = require('./models/Lecture');
const Note = require('./models/Note');
const CourseEnrollment = require('./models/NoteEnrollment');
const StudentWorkspace = require('./models/StudentWorkspace');

// Controllers
const {
  createCourse,
  enrollInCourse,
  unenrollFromCourse
} = require('./controllers/courseController');
const { createSemester } = require('./controllers/semesterController');
const { createSubject } = require('./controllers/subjectController');
const { createLecture } = require('./controllers/lectureController');
const {
  createNote,
  getNoteById,
  deleteNote,
  incrementNoteDownload
} = require('./controllers/noteController');
const {
  getWorkspace,
  saveWorkspace,
  deleteWorkspace
} = require('./controllers/workspaceController');

// Test Helper: Mock Request and Response
const mockReqRes = (reqData = {}) => {
  const req = {
    params: {},
    query: {},
    body: {},
    user: null,
    headers: {},
    cookies: {},
    ...reqData
  };

  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };

  return { req, res };
};

// Generic Mongoose Query Chain Mock Helper
const createQueryMock = (resultDoc) => {
  const query = {
    populate() {
      return this;
    },
    select() {
      return this;
    },
    lean() {
      return this;
    },
    sort() {
      return this;
    },
    skip() {
      return this;
    },
    limit() {
      return this;
    },
    then(resolve, reject) {
      return Promise.resolve(resultDoc).then(resolve, reject);
    },
    catch(reject) {
      return Promise.resolve(resultDoc).catch(reject);
    }
  };
  return query;
};

// Generate valid ObjectIds for testing
const studentAId = new mongoose.Types.ObjectId();
const studentBId = new mongoose.Types.ObjectId();
const courseId = new mongoose.Types.ObjectId();
const semesterId = new mongoose.Types.ObjectId();
const subjectId = new mongoose.Types.ObjectId();
const lectureId = new mongoose.Types.ObjectId();
const noteId = new mongoose.Types.ObjectId();

let passedTests = 0;
let totalTests = 0;

const runTest = async (testName, fn) => {
  totalTests++;
  try {
    await fn();
    console.log(`PASS [${totalTests}]: ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`FAIL [${totalTests}]: ${testName}`);
    console.error(err);
  }
};

(async () => {
  console.log('--- Starting Backend Academic Suite Tests ---');

  // TEST 1: Two students creating/selecting the same course (variations like B.Tech vs B Tech)
  await runTest('Two students creating/selecting the same course (canonical match)', async () => {
    const existingCourse = {
      _id: courseId,
      name: 'B.Tech Computer Science',
      slug: 'btech-computer-science',
      courseType: 'ACADEMIC',
      isActive: true
    };

    // Mock Course.findOne to return null for exact match, but found for candidates
    const origFindOne = Course.findOne;
    const origFind = Course.find;

    Course.findOne = async () => null;
    Course.find = () => ({
      select: () => [existingCourse]
    });

    const { req, res } = mockReqRes({
      user: { userId: studentBId, role: 'STUDENT' },
      body: { name: 'B Tech Computer Science', courseType: 'ACADEMIC' }
    });

    await createCourse(req, res);

    Course.findOne = origFindOne;
    Course.find = origFind;

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data._id.toString(), courseId.toString());
    assert.strictEqual(res.body.message, 'Existing course found and selected');
  });

  // TEST 2: Duplicate semester creation under the same course
  await runTest('Duplicate semester creation under the same course returns existing', async () => {
    const origCourseFindById = Course.findById;
    const origSemesterFindOne = Semester.findOne;

    Course.findById = async () => ({ _id: courseId, isActive: true, totalSemesters: 4 });
    const existingSemester = {
      _id: semesterId,
      course: courseId,
      semesterNumber: 1,
      name: 'Semester 1',
      isActive: true
    };
    Semester.findOne = async () => existingSemester;

    const { req, res } = mockReqRes({
      params: { courseId: courseId.toString() },
      user: { userId: studentBId, role: 'STUDENT' },
      body: { semesterNumber: 1, name: 'Semester 1' }
    });

    await createSemester(req, res);

    Course.findById = origCourseFindById;
    Semester.findOne = origSemesterFindOne;

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data._id.toString(), semesterId.toString());
    assert.strictEqual(res.body.message, 'Existing semester found and selected');
  });

  // TEST 3: Duplicate subject creation within a semester
  await runTest('Duplicate subject creation within a semester returns existing', async () => {
    const origSemesterFindById = Semester.findById;
    const origSubjectFindOne = Subject.findOne;

    Semester.findById = () => ({
      populate: async () => ({
        _id: semesterId,
        isActive: true,
        course: { _id: courseId, isActive: true }
      })
    });

    const existingSubject = {
      _id: subjectId,
      semester: semesterId,
      course: courseId,
      name: 'Data Structures',
      slug: 'data-structures',
      isActive: true
    };
    Subject.findOne = async () => existingSubject;

    const { req, res } = mockReqRes({
      params: { semesterId: semesterId.toString() },
      user: { userId: studentBId, role: 'STUDENT' },
      body: { name: 'Data Structures' }
    });

    await createSubject(req, res);

    Semester.findById = origSemesterFindById;
    Subject.findOne = origSubjectFindOne;

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data._id.toString(), subjectId.toString());
    assert.strictEqual(res.body.message, 'Existing subject found and selected');
  });

  // TEST 4: Duplicate lecture number within a subject
  await runTest('Duplicate lecture number within a subject returns existing', async () => {
    const origSubjectFindById = Subject.findById;
    const origLectureFindOne = Lecture.findOne;

    Subject.findById = () => ({
      populate: async () => ({
        _id: subjectId,
        semester: semesterId,
        isActive: true,
        course: { _id: courseId, isActive: true }
      })
    });

    const existingLecture = {
      _id: lectureId,
      subject: subjectId,
      semester: semesterId,
      course: courseId,
      lectureNumber: 1,
      title: 'Introduction to Arrays',
      isActive: true
    };
    Lecture.findOne = async () => existingLecture;

    const { req, res } = mockReqRes({
      params: { subjectId: subjectId.toString() },
      user: { userId: studentBId, role: 'STUDENT' },
      body: { lectureNumber: 1, title: 'Introduction' }
    });

    await createLecture(req, res);

    Subject.findById = origSubjectFindById;
    Lecture.findOne = origLectureFindOne;

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data._id.toString(), lectureId.toString());
    assert.strictEqual(res.body.message, 'Existing lecture found and selected');
  });

  // TEST 5: Invalid course/semester/subject/lecture combinations
  await runTest('Invalid course/semester/subject/lecture combinations are rejected', async () => {
    const origCourseFindById = Course.findById;
    const origSemesterFindById = Semester.findById;

    Course.findById = async () => ({ _id: courseId, isActive: true });
    // Semester has mismatched course
    const wrongCourseId = new mongoose.Types.ObjectId();
    Semester.findById = async () => ({
      _id: semesterId,
      course: wrongCourseId,
      isActive: true
    });

    const { req, res } = mockReqRes({
      user: { userId: studentAId, role: 'STUDENT' },
      body: {
        title: 'Algorithms Lecture 1',
        course: courseId.toString(),
        semester: semesterId.toString(),
        subject: subjectId.toString(),
        fileUrl: 'https://cloudinary.com/note.pdf',
        fileName: 'note.pdf'
      }
    });

    await createNote(req, res);

    Course.findById = origCourseFindById;
    Semester.findById = origSemesterFindById;

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('does not belong to the selected course'));
  });

  // TEST 6: Student cannot view or delete another student's PRIVATE note
  await runTest("Student cannot view or delete another student's PRIVATE note", async () => {
    const origNoteFindById = Note.findById;

    const privateNote = {
      _id: noteId,
      owner: studentAId,
      visibility: 'PRIVATE',
      status: 'PUBLISHED',
      course: courseId,
      toObject: () => ({ _id: noteId, owner: { _id: studentAId } })
    };
    Note.findById = () => createQueryMock(privateNote);

    // Student B requests Student A's private note
    const { req: getReq, res: getRes } = mockReqRes({
      params: { id: noteId.toString() },
      user: { userId: studentBId, role: 'STUDENT' }
    });

    await getNoteById(getReq, getRes);
    assert.strictEqual(getRes.statusCode, 403);
    assert.strictEqual(getRes.body.success, false);

    // Student B attempts to delete Student A's note
    Note.findById = async () => privateNote;
    const { req: delReq, res: delRes } = mockReqRes({
      params: { id: noteId.toString() },
      user: { userId: studentBId, role: 'STUDENT' }
    });

    await deleteNote(delReq, delRes);
    assert.strictEqual(delRes.statusCode, 403);
    assert.strictEqual(delRes.body.success, false);

    Note.findById = origNoteFindById;
  });

  // TEST 7: PUBLIC note access works for eligible students
  await runTest('PUBLIC note access works for eligible students', async () => {
    const origNoteFindById = Note.findById;

    const publicNote = {
      _id: noteId,
      owner: { _id: studentAId, name: 'Student A', email: 'a@example.com' },
      visibility: 'PUBLIC',
      status: 'PUBLISHED',
      course: courseId,
      toObject: function () {
        return { ...this, owner: { ...this.owner } };
      }
    };

    Note.findById = () => createQueryMock(publicNote);

    const { req, res } = mockReqRes({
      params: { id: noteId.toString() },
      user: { userId: studentBId, role: 'STUDENT' }
    });

    await getNoteById(req, res);

    Note.findById = origNoteFindById;

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.owner.email, undefined); // Sensitive email redacted for other students
  });

  // TEST 8: ENROLLED note access requires active course enrollment
  await runTest('ENROLLED note access requires active course enrollment', async () => {
    const origNoteFindById = Note.findById;
    const origEnrollmentExists = CourseEnrollment.exists;

    const enrolledNote = {
      _id: noteId,
      owner: studentAId,
      visibility: 'ENROLLED',
      status: 'PUBLISHED',
      course: { _id: courseId },
      toObject: () => ({ _id: noteId, owner: { _id: studentAId } })
    };

    Note.findById = () => createQueryMock(enrolledNote);

    // Subcase 8a: Student without enrollment is rejected
    CourseEnrollment.exists = async () => false;

    const { req: unReq, res: unRes } = mockReqRes({
      params: { id: noteId.toString() },
      user: { userId: studentBId, role: 'STUDENT' }
    });

    await getNoteById(unReq, unRes);
    assert.strictEqual(unRes.statusCode, 403);
    assert.strictEqual(unRes.body.isEnrollmentRequired, true);

    // Subcase 8b: Student with active enrollment is permitted
    CourseEnrollment.exists = async () => true;

    const { req: enReq, res: enRes } = mockReqRes({
      params: { id: noteId.toString() },
      user: { userId: studentBId, role: 'STUDENT' }
    });

    await getNoteById(enReq, enRes);
    assert.strictEqual(enRes.statusCode, 200);
    assert.strictEqual(enRes.body.success, true);

    Note.findById = origNoteFindById;
    CourseEnrollment.exists = origEnrollmentExists;
  });

  // TEST 9: Duplicate enrollment and cancelled enrollment reactivation
  await runTest('Duplicate enrollment and cancelled enrollment reactivation', async () => {
    const origCourseFindById = Course.findById;
    const origCourseFindByIdAndUpdate = Course.findByIdAndUpdate;
    const origEnrollmentFindOne = CourseEnrollment.findOne;

    Course.findById = async () => ({ _id: courseId, isActive: true });
    Course.findByIdAndUpdate = async () => ({});

    // Subcase 9a: Already active enrollment
    CourseEnrollment.findOne = async () => ({
      _id: new mongoose.Types.ObjectId(),
      student: studentBId,
      course: courseId,
      status: 'ACTIVE'
    });

    const { req: dupReq, res: dupRes } = mockReqRes({
      params: { id: courseId.toString() },
      user: { userId: studentBId, role: 'STUDENT' }
    });

    await enrollInCourse(dupReq, dupRes);
    assert.strictEqual(dupRes.statusCode, 200);
    assert.strictEqual(dupRes.body.message, 'Already enrolled in this course');

    // Subcase 9b: Reactivation of cancelled enrollment
    let savedStatus = 'CANCELLED';
    CourseEnrollment.findOne = async () => ({
      _id: new mongoose.Types.ObjectId(),
      student: studentBId,
      course: courseId,
      status: 'CANCELLED',
      save: async function () {
        savedStatus = this.status;
      }
    });

    const { req: reactReq, res: reactRes } = mockReqRes({
      params: { id: courseId.toString() },
      user: { userId: studentBId, role: 'STUDENT' }
    });

    await enrollInCourse(reactReq, reactRes);
    assert.strictEqual(reactRes.statusCode, 200);
    assert.strictEqual(savedStatus, 'ACTIVE');
    assert.strictEqual(reactRes.body.message, 'Course enrollment reactivated successfully');

    Course.findById = origCourseFindById;
    Course.findByIdAndUpdate = origCourseFindByIdAndUpdate;
    CourseEnrollment.findOne = origEnrollmentFindOne;
  });

  // TEST 10: Student cannot impersonate another student by changing request IDs
  await runTest('Student cannot impersonate another student by changing request IDs', async () => {
    const origCourseFindById = Course.findById;
    const origSemesterFindById = Semester.findById;
    const origSubjectFindById = Subject.findById;
    const origNoteCreate = Note.create;
    const origCourseUpdate = Course.findByIdAndUpdate;
    const origSemesterUpdate = Semester.findByIdAndUpdate;
    const origSubjectUpdate = Subject.findByIdAndUpdate;

    Course.findById = async () => ({ _id: courseId, isActive: true });
    Semester.findById = async () => ({ _id: semesterId, course: courseId, isActive: true });
    Subject.findById = async () => ({ _id: subjectId, semester: semesterId, course: courseId, isActive: true });
    Course.findByIdAndUpdate = async () => ({});
    Semester.findByIdAndUpdate = async () => ({});
    Subject.findByIdAndUpdate = async () => ({});

    let createdNoteDoc = null;
    Note.create = async (doc) => {
      createdNoteDoc = doc;
      return doc;
    };

    const { req, res } = mockReqRes({
      user: { userId: studentBId, role: 'STUDENT' },
      body: {
        title: 'Legitimate Note',
        owner: studentAId.toString(), // Attacker tries to impersonate Student A
        createdBy: studentAId.toString(),
        course: courseId.toString(),
        semester: semesterId.toString(),
        subject: subjectId.toString(),
        fileUrl: 'https://cloudinary.com/file.pdf',
        fileName: 'file.pdf',
        fileType: 'PDF'
      }
    });

    await createNote(req, res);

    Course.findById = origCourseFindById;
    Semester.findById = origSemesterFindById;
    Subject.findById = origSubjectFindById;
    Course.findByIdAndUpdate = origCourseUpdate;
    Semester.findByIdAndUpdate = origSemesterUpdate;
    Subject.findByIdAndUpdate = origSubjectUpdate;
    Note.create = origNoteCreate;

    assert.strictEqual(res.statusCode, 201);
    // Verified: owner and createdBy were derived from authenticated user, not client body
    assert.strictEqual(createdNoteDoc.owner.toString(), studentBId.toString());
    assert.strictEqual(createdNoteDoc.createdBy.toString(), studentBId.toString());
  });

  // TEST 11: PENDING/REJECTED/ARCHIVED notes are not exposed to ordinary students
  await runTest('PENDING/REJECTED/ARCHIVED notes are not exposed to ordinary students', async () => {
    const origNoteFindById = Note.findById;

    const pendingNote = {
      _id: noteId,
      owner: studentAId,
      visibility: 'PUBLIC',
      status: 'PENDING',
      toObject: () => ({ _id: noteId, status: 'PENDING' })
    };

    Note.findById = () => createQueryMock(pendingNote);

    const { req, res } = mockReqRes({
      params: { id: noteId.toString() },
      user: { userId: studentBId, role: 'STUDENT' }
    });

    await getNoteById(req, res);

    Note.findById = origNoteFindById;

    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Note not found');
  });

  // TEST 12: Invalid file uploads and unauthorized downloads are rejected
  await runTest('Invalid file uploads and unauthorized downloads are rejected', async () => {
    const origCourseFindById = Course.findById;
    const origSemesterFindById = Semester.findById;
    const origSubjectFindById = Subject.findById;

    Course.findById = async () => ({ _id: courseId, isActive: true });
    Semester.findById = async () => ({ _id: semesterId, course: courseId, isActive: true });
    Subject.findById = async () => ({ _id: subjectId, semester: semesterId, course: courseId, isActive: true });

    // Subcase 12a: Invalid file extension
    const { req: invReq, res: invRes } = mockReqRes({
      user: { userId: studentAId, role: 'STUDENT' },
      body: {
        title: 'Dangerous File',
        course: courseId.toString(),
        semester: semesterId.toString(),
        subject: subjectId.toString(),
        fileUrl: 'https://unsafe.com/file.exe',
        fileName: 'script.exe',
        fileType: 'EXE'
      }
    });

    await createNote(invReq, invRes);
    assert.strictEqual(invRes.statusCode, 400);
    assert.strictEqual(invRes.body.success, false);
    assert.ok(invRes.body.message.includes('Invalid file type'));

    Course.findById = origCourseFindById;
    Semester.findById = origSemesterFindById;
    Subject.findById = origSubjectFindById;

    // Subcase 12b: Unauthorized download of private note
    const origNoteFindById = Note.findById;
    Note.findById = async () => ({
      _id: noteId,
      owner: studentAId,
      visibility: 'PRIVATE',
      status: 'PUBLISHED'
    });

    const { req: dlReq, res: dlRes } = mockReqRes({
      params: { id: noteId.toString() },
      user: { userId: studentBId, role: 'STUDENT' }
    });

    await incrementNoteDownload(dlReq, dlRes);
    assert.strictEqual(dlRes.statusCode, 403);
    assert.strictEqual(dlRes.body.success, false);

    Note.findById = origNoteFindById;
  });

  // TEST 13: StudentWorkspace save with partial progress and populated restore
  await runTest('StudentWorkspace save with partial selections, updates lastVisitedAt and restores populated state', async () => {
    const origCourseFindById = Course.findById;
    const origSemesterFindById = Semester.findById;
    const origSubjectFindById = Subject.findById;
    const origWsFindOne = StudentWorkspace.findOne;
    const origWsCreate = StudentWorkspace.create;
    const origWsFindById = StudentWorkspace.findById;

    Course.findById = async () => ({ _id: courseId, isActive: true });
    Semester.findById = async () => ({ _id: semesterId, course: courseId, isActive: true });
    Subject.findById = async () => ({ _id: subjectId, semester: semesterId, course: courseId, isActive: true });

    let createdWsDoc = null;
    StudentWorkspace.findOne = async () => null; // Not existing yet
    StudentWorkspace.create = async (doc) => {
      createdWsDoc = {
        _id: new mongoose.Types.ObjectId(),
        ...doc,
        save: async function () {}
      };
      return createdWsDoc;
    };

    StudentWorkspace.findById = () => ({
      populate: () => ({
        populate: () => ({
          populate: () => ({
            populate: async () => ({
              ...createdWsDoc,
              course: { _id: courseId, name: 'B.Tech CS' },
              semester: { _id: semesterId, semesterNumber: 1 },
              subject: { _id: subjectId, name: 'Data Structures' },
              lecture: null
            })
          })
        })
      })
    });

    const { req, res } = mockReqRes({
      user: { userId: studentAId, role: 'STUDENT' },
      body: {
        course: courseId.toString(),
        semester: semesterId.toString(),
        subject: subjectId.toString(),
        // lecture omitted to test partial progress
        progressStatus: 'IN_PROGRESS'
      }
    });

    await saveWorkspace(req, res);

    Course.findById = origCourseFindById;
    Semester.findById = origSemesterFindById;
    Subject.findById = origSubjectFindById;
    StudentWorkspace.findOne = origWsFindOne;
    StudentWorkspace.create = origWsCreate;
    StudentWorkspace.findById = origWsFindById;

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(createdWsDoc.student.toString(), studentAId.toString());
    assert.strictEqual(createdWsDoc.course.toString(), courseId.toString());
    assert.strictEqual(createdWsDoc.semester.toString(), semesterId.toString());
    assert.strictEqual(createdWsDoc.subject.toString(), subjectId.toString());
    assert.strictEqual(createdWsDoc.lecture, null);
    assert.ok(createdWsDoc.lastVisitedAt instanceof Date);
  });

  // TEST 14: Workspace selection never creates enrollment and enrollment never creates workspace
  await runTest('Workspace selection is decoupled from CourseEnrollment', async () => {
    let enrollmentCalled = false;
    let workspaceCalled = false;

    const origCourseFindById = Course.findById;
    const origEnrollmentCreate = CourseEnrollment.create;
    const origWsCreate = StudentWorkspace.create;
    const origWsFindOne = StudentWorkspace.findOne;
    const origWsFindById = StudentWorkspace.findById;

    Course.findById = async () => ({ _id: courseId, isActive: true });
    CourseEnrollment.create = async () => {
      enrollmentCalled = true;
      return {};
    };
    StudentWorkspace.findOne = async () => null;
    StudentWorkspace.create = async (doc) => {
      workspaceCalled = true;
      return { _id: new mongoose.Types.ObjectId(), ...doc, save: async () => {} };
    };
    StudentWorkspace.findById = () => ({
      populate: () => ({ populate: () => ({ populate: () => ({ populate: async () => ({}) }) }) })
    });

    // Subcase 14a: Saving workspace does NOT call CourseEnrollment.create
    const { req: wsReq, res: wsRes } = mockReqRes({
      user: { userId: studentAId, role: 'STUDENT' },
      body: { course: courseId.toString() }
    });

    await saveWorkspace(wsReq, wsRes);
    assert.strictEqual(wsRes.statusCode, 201);
    assert.strictEqual(workspaceCalled, true);
    assert.strictEqual(enrollmentCalled, false); // Enrollment was not touched

    // Subcase 14b: Enrolling does NOT call StudentWorkspace.create
    workspaceCalled = false;
    enrollmentCalled = false;
    const origEnrollmentFindOne = CourseEnrollment.findOne;
    CourseEnrollment.findOne = async () => null;
    CourseEnrollment.create = async () => {
      enrollmentCalled = true;
      return { _id: new mongoose.Types.ObjectId(), status: 'ACTIVE' };
    };

    const { req: enReq, res: enRes } = mockReqRes({
      params: { id: courseId.toString() },
      user: { userId: studentAId, role: 'STUDENT' }
    });

    await enrollInCourse(enReq, enRes);
    assert.strictEqual(enRes.statusCode, 201);
    assert.strictEqual(enrollmentCalled, true);
    assert.strictEqual(workspaceCalled, false); // Workspace was not touched

    Course.findById = origCourseFindById;
    CourseEnrollment.create = origEnrollmentCreate;
    CourseEnrollment.findOne = origEnrollmentFindOne;
    StudentWorkspace.create = origWsCreate;
    StudentWorkspace.findOne = origWsFindOne;
    StudentWorkspace.findById = origWsFindById;
  });

  // TEST 15: Student A and Student B workspaces are strictly isolated
  await runTest('Student workspace queries never expose another student workspace', async () => {
    let queriedStudentFilter = null;
    const origWsFindOne = StudentWorkspace.findOne;

    StudentWorkspace.findOne = (query) => {
      queriedStudentFilter = query.student;
      return {
        populate: () => ({
          populate: () => ({
            populate: () => ({
              populate: async () => ({
                _id: new mongoose.Types.ObjectId(),
                student: studentBId,
                course: { _id: courseId, name: 'B.Tech' }
              })
            })
          })
        })
      };
    };

    const { req, res } = mockReqRes({
      user: { userId: studentBId, role: 'STUDENT' },
      params: { courseId: courseId.toString() }
    });

    await getWorkspace(req, res);

    StudentWorkspace.findOne = origWsFindOne;

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    // Verified: Queried strictly with studentBId derived from req.user
    assert.strictEqual(queriedStudentFilter.toString(), studentBId.toString());
  });

  // TEST 16: Draft notes support without file vs published notes requiring file
  await runTest('Draft note creation without file succeeds; published note without file is rejected', async () => {
    const origCourseFindById = Course.findById;
    const origSemesterFindById = Semester.findById;
    const origSubjectFindById = Subject.findById;
    const origNoteCreate = Note.create;

    Course.findById = async () => ({ _id: courseId, isActive: true });
    Semester.findById = async () => ({ _id: semesterId, course: courseId, isActive: true });
    Subject.findById = async () => ({ _id: subjectId, semester: semesterId, course: courseId, isActive: true });

    let savedDraftDoc = null;
    Note.create = async (doc) => {
      savedDraftDoc = doc;
      return doc;
    };

    // Subcase 16a: Status DRAFT with no file succeeds
    const { req: draftReq, res: draftRes } = mockReqRes({
      user: { userId: studentAId, role: 'STUDENT' },
      body: {
        title: 'Draft Notes on Dynamic Programming',
        course: courseId.toString(),
        semester: semesterId.toString(),
        subject: subjectId.toString(),
        status: 'DRAFT'
      }
    });

    await createNote(draftReq, draftRes);
    assert.strictEqual(draftRes.statusCode, 201);
    assert.strictEqual(savedDraftDoc.status, 'DRAFT');
    assert.strictEqual(savedDraftDoc.fileUrl, undefined);

    // Subcase 16b: Status PUBLISHED with no file is rejected
    const { req: pubReq, res: pubRes } = mockReqRes({
      user: { userId: studentAId, role: 'STUDENT' },
      body: {
        title: 'Published Notes without File',
        course: courseId.toString(),
        semester: semesterId.toString(),
        subject: subjectId.toString(),
        status: 'PUBLISHED'
      }
    });

    await createNote(pubReq, pubRes);
    assert.strictEqual(pubRes.statusCode, 400);
    assert.strictEqual(pubRes.body.success, false);
    assert.ok(pubRes.body.message.includes('upload a note file'));

    Course.findById = origCourseFindById;
    Semester.findById = origSemesterFindById;
    Subject.findById = origSubjectFindById;
    Note.create = origNoteCreate;
  });

  // TEST 17: Duplicate key error (11000) on concurrent workspace save handles gracefully
  await runTest('Concurrent workspace save duplicate-key error (11000) resolves safely', async () => {
    const origCourseFindById = Course.findById;
    const origWsFindOne = StudentWorkspace.findOne;
    const origWsCreate = StudentWorkspace.create;
    const origWsFindById = StudentWorkspace.findById;

    Course.findById = async () => ({ _id: courseId, isActive: true });

    let findCallCount = 0;
    const existingWsDoc = {
      _id: new mongoose.Types.ObjectId(),
      student: studentAId,
      course: courseId,
      semester: null,
      subject: null,
      lecture: null,
      save: async function () {}
    };

    StudentWorkspace.findOne = async () => {
      findCallCount++;
      if (findCallCount === 1) return null; // Initially null to simulate race
      return existingWsDoc; // Found on recovery
    };

    StudentWorkspace.create = async () => {
      const err = new Error('E11000 duplicate key error collection');
      err.code = 11000;
      throw err;
    };

    StudentWorkspace.findById = () => ({
      populate: () => ({ populate: () => ({ populate: () => ({ populate: async () => existingWsDoc }) }) })
    });

    const { req, res } = mockReqRes({
      user: { userId: studentAId, role: 'STUDENT' },
      body: { course: courseId.toString() }
    });

    await saveWorkspace(req, res);

    Course.findById = origCourseFindById;
    StudentWorkspace.findOne = origWsFindOne;
    StudentWorkspace.create = origWsCreate;
    StudentWorkspace.findById = origWsFindById;

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.message, 'Workspace saved successfully');
  });

  console.log(`\n================================`);
  console.log(`Test Execution Finished: ${passedTests}/${totalTests} Tests Passed`);
  console.log(`================================`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
})();
