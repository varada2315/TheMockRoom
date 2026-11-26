import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db, User, Course, Enrollment, MentorCourse, ScoreRecord, ScoreHistoryEntry, ResumeRecord } from './db';
import { generateToken, requireAuth, requireAdmin, requireMentor, requireStudent, AuthenticatedRequest } from './auth';

export const apiRouter = Router();

const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `resume_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.rtf', '.txt', '.pages', '.odt', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported document type. Please upload a PDF, DOC, DOCX, RTF, TXT, PAGES, ODT, or Image file.'));
    }
  },
});

// Helper for generating credentials
function generateRandomCredentials(role: 'student' | 'mentor', name: string) {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const username = `${role}_${cleanName}_${randomNum}`;
  const rawPassword = `${cleanName.charAt(0).toUpperCase()}${cleanName.slice(1)}@${randomNum}!`;
  return { username, rawPassword };
}

// ----------------------------------------------------
// 1. AUTH ROUTES
// ----------------------------------------------------
apiRouter.post('/auth/login', (req, res) => {
  const { username, password, expectedRole } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const database = db.getDb();
  const user = database.users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());

  if (!user || !user.isActive) {
    res.status(401).json({ error: 'Invalid credentials or user account deactivated' });
    return;
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  if (expectedRole && user.role !== expectedRole && !(expectedRole === 'superadmin' && user.role === 'superadmin')) {
    res.status(403).json({ error: `Access denied. Account is not a ${expectedRole}.` });
    return;
  }

  const token = generateToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone,
      address: user.address,
    },
  });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const { passwordHash, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// ----------------------------------------------------
// 2. SUPER ADMIN ROUTES (Private / Unlisted)
// ----------------------------------------------------
apiRouter.get('/admin/overview', ...requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const database = db.getDb();
  
  const students = database.users.filter(u => u.role === 'student');
  const mentors = database.users.filter(u => u.role === 'mentor');

  const detailedStudents = students.map(s => {
    const enrollment = database.enrollments.find(e => e.studentId === s.id);
    const course = enrollment ? database.courses.find(c => c.id === enrollment.courseId) : null;
    
    // Course-based mentor lookup
    const mentorCourseLinks = enrollment ? (database.mentor_courses || []).filter(mc => mc.courseId === enrollment.courseId) : [];
    const mentorIds = mentorCourseLinks.map(mc => mc.mentorId);
    const courseMentors = database.users.filter(u => u.role === 'mentor' && mentorIds.includes(u.id)).map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
    }));

    const score = database.scores.find(sc => sc.studentId === s.id);
    const history = database.score_history.filter(sh => sh.studentId === s.id);
    const resume = database.resumes.find(r => r.studentId === s.id);

    return {
      ...s,
      enrolledCourse: course || null,
      assignedMentors: courseMentors,
      scores: score || null,
      scoreHistory: history || [],
      resume: resume || null,
    };
  });

  const detailedMentors = mentors.map(m => {
    const mentorCourseLinks = (database.mentor_courses || []).filter(mc => mc.mentorId === m.id);
    const assignedCourseIds = mentorCourseLinks.map(mc => mc.courseId);
    const assignedCourses = database.courses.filter(c => assignedCourseIds.includes(c.id));

    return {
      ...m,
      assignedCourses,
      assignedCourseIds,
    };
  });

  res.json({
    students: detailedStudents,
    mentors: detailedMentors,
    courses: database.courses,
    enrollments: database.enrollments,
    totalStudents: students.length,
    totalMentors: mentors.length,
    totalCourses: database.courses.length,
  });
});

apiRouter.post('/admin/students', ...requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, email, phone, address, courseId } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ error: 'Name, Email, and Phone are required' });
    return;
  }

  const database = db.getDb();
  const existingUser = database.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existingUser) {
    res.status(400).json({ error: 'A user with this email already exists' });
    return;
  }

  const { username, rawPassword } = generateRandomCredentials('student', name);
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(rawPassword, salt);

  const newStudent: User = {
    id: `usr_std_${Date.now()}`,
    username,
    passwordHash,
    role: 'student',
    name,
    email: email.trim(),
    phone: phone.trim(),
    address: address ? address.trim() : '',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  database.users.push(newStudent);

  if (courseId) {
    const courseExists = database.courses.find(c => c.id === courseId);
    if (courseExists) {
      const newEnrollment: Enrollment = {
        id: `enr_${Date.now()}`,
        studentId: newStudent.id,
        courseId,
        enrolledAt: new Date().toISOString(),
      };
      database.enrollments.push(newEnrollment);
    }
  }

  db.save();

  res.status(201).json({
    message: 'Student created successfully',
    student: newStudent,
    generatedCredentials: {
      username,
      password: rawPassword,
    },
  });
});

apiRouter.put('/admin/students/:id', ...requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, address, courseId, isActive, username, password } = req.body;

  const database = db.getDb();
  const student = database.users.find(u => u.id === id && u.role === 'student');

  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  if (username && username.trim() !== student.username) {
    const existing = database.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== id);
    if (existing) {
      res.status(400).json({ error: 'Username already in use by another user' });
      return;
    }
    student.username = username.trim();
  }

  if (password && password.trim().length > 0) {
    const salt = bcrypt.genSaltSync(10);
    student.passwordHash = bcrypt.hashSync(password.trim(), salt);
  }

  if (name) student.name = name;
  if (email) student.email = email;
  if (phone) student.phone = phone;
  if (address !== undefined) student.address = address;
  if (isActive !== undefined) student.isActive = Boolean(isActive);

  if (courseId !== undefined) {
    let enrollment = database.enrollments.find(e => e.studentId === student.id);
    if (!enrollment) {
      if (courseId) {
        enrollment = {
          id: `enr_${Date.now()}`,
          studentId: student.id,
          courseId,
          enrolledAt: new Date().toISOString(),
        };
        database.enrollments.push(enrollment);
      }
    } else {
      if (courseId) enrollment.courseId = courseId;
    }
  }

  db.save();
  res.json({ message: 'Student updated successfully', student });
});

apiRouter.post('/admin/mentors', ...requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, email, phone, courseIds } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ error: 'Name, Email, and Phone are required' });
    return;
  }

  const database = db.getDb();
  const existingUser = database.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existingUser) {
    res.status(400).json({ error: 'A user with this email already exists' });
    return;
  }

  const { username, rawPassword } = generateRandomCredentials('mentor', name);
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(rawPassword, salt);

  const newMentor: User = {
    id: `usr_mnt_${Date.now()}`,
    username,
    passwordHash,
    role: 'mentor',
    name,
    email: email.trim(),
    phone: phone.trim(),
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  database.users.push(newMentor);

  if (!database.mentor_courses) database.mentor_courses = [];
  if (Array.isArray(courseIds)) {
    courseIds.forEach(cId => {
      const mcRecord: MentorCourse = {
        id: `mc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        mentorId: newMentor.id,
        courseId: cId,
        assignedAt: new Date().toISOString(),
      };
      database.mentor_courses.push(mcRecord);
    });
  }

  db.save();

  res.status(201).json({
    message: 'Mentor created successfully',
    mentor: newMentor,
    generatedCredentials: {
      username,
      password: rawPassword,
    },
  });
});

apiRouter.put('/admin/mentors/:id', ...requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, username, password, isActive, courseIds } = req.body;

  const database = db.getDb();
  const mentor = database.users.find(u => u.id === id && u.role === 'mentor');

  if (!mentor) {
    res.status(404).json({ error: 'Mentor not found' });
    return;
  }

  if (username && username.trim() !== mentor.username) {
    const existing = database.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== id);
    if (existing) {
      res.status(400).json({ error: 'Username already in use by another user' });
      return;
    }
    mentor.username = username.trim();
  }

  if (password && password.trim().length > 0) {
    const salt = bcrypt.genSaltSync(10);
    mentor.passwordHash = bcrypt.hashSync(password.trim(), salt);
  }

  if (name) mentor.name = name;
  if (email) mentor.email = email;
  if (phone) mentor.phone = phone;
  if (isActive !== undefined) mentor.isActive = Boolean(isActive);

  if (Array.isArray(courseIds)) {
    if (!database.mentor_courses) database.mentor_courses = [];
    database.mentor_courses = database.mentor_courses.filter(mc => mc.mentorId !== mentor.id);
    courseIds.forEach(cId => {
      database.mentor_courses.push({
        id: `mc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        mentorId: mentor.id,
        courseId: cId,
        assignedAt: new Date().toISOString(),
      });
    });
  }

  db.save();
  res.json({ message: 'Mentor updated successfully', mentor });
});

apiRouter.delete('/admin/students/:id', ...requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const database = db.getDb();
  const index = database.users.findIndex(u => u.id === id && u.role === 'student');

  if (index === -1) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  const deleted = database.users.splice(index, 1)[0];
  database.enrollments = (database.enrollments || []).filter(e => e.studentId !== id);
  database.scores = (database.scores || []).filter((s: ScoreRecord) => s.studentId !== id);
  database.score_history = (database.score_history || []).filter((sh: ScoreHistoryEntry) => sh.studentId !== id);
  database.resumes = (database.resumes || []).filter(r => r.studentId !== id);

  db.save();
  res.json({ message: 'Student deleted successfully', student: deleted });
});

apiRouter.delete('/admin/mentors/:id', ...requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const database = db.getDb();
  const index = database.users.findIndex(u => u.id === id && u.role === 'mentor');

  if (index === -1) {
    res.status(404).json({ error: 'Mentor not found' });
    return;
  }

  const deleted = database.users.splice(index, 1)[0];
  database.mentor_courses = (database.mentor_courses || []).filter(mc => mc.mentorId !== id);

  db.save();
  res.json({ message: 'Mentor deleted successfully', mentor: deleted });
});

apiRouter.get('/admin/courses', ...requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const database = db.getDb();
  res.json({ courses: database.courses });
});

apiRouter.post('/admin/courses', ...requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, code, description } = req.body;
  if (!title || !code) {
    res.status(400).json({ error: 'Title and Course Code are required' });
    return;
  }

  const database = db.getDb();
  const newCourse: Course = {
    id: `crs_${Date.now()}`,
    title,
    code,
    description: description || '',
    createdAt: new Date().toISOString(),
  };

  database.courses.push(newCourse);
  db.save();

  res.status(201).json({ message: 'Course created successfully', course: newCourse });
});

apiRouter.post('/admin/assign-course', ...requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    res.status(400).json({ error: 'Student ID and Course ID are required' });
    return;
  }

  const database = db.getDb();
  let enrollment = database.enrollments.find(e => e.studentId === studentId);
  if (!enrollment) {
    enrollment = {
      id: `enr_${Date.now()}`,
      studentId,
      courseId,
      enrolledAt: new Date().toISOString(),
    };
    database.enrollments.push(enrollment);
  } else {
    enrollment.courseId = courseId;
  }

  db.save();
  res.json({ message: 'Course assigned successfully', enrollment });
});

// ----------------------------------------------------
// 3. MENTOR ROUTES
// ----------------------------------------------------
apiRouter.get('/mentor/students', ...requireMentor, (req: AuthenticatedRequest, res: Response) => {
  const database = db.getDb();
  const mentor = req.user!;

  let mentorCourseIds: string[] = [];
  if (mentor.role === 'superadmin') {
    mentorCourseIds = database.courses.map(c => c.id);
  } else {
    const mentorCourseLinks = (database.mentor_courses || []).filter(mc => mc.mentorId === mentor.id);
    mentorCourseIds = Array.from(new Set(mentorCourseLinks.map(mc => mc.courseId)));
  }

  const enrollments = database.enrollments.filter(e => mentorCourseIds.includes(e.courseId));
  const studentIds = Array.from(new Set(enrollments.map(e => e.studentId)));

  const assignedStudents = database.users
    .filter(u => u.role === 'student' && studentIds.includes(u.id))
    .map(s => {
      const enr = enrollments.find(e => e.studentId === s.id);
      const course = enr ? database.courses.find(c => c.id === enr.courseId) : null;
      const score = database.scores.find(sc => sc.studentId === s.id);
      const history = database.score_history.filter(sh => sh.studentId === s.id);
      const resume = database.resumes.find(r => r.studentId === s.id);

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        address: s.address,
        isActive: s.isActive,
        enrolledCourse: course || null,
        scores: score || null,
        scoreHistory: history || [],
        resume: resume || null,
      };
    });

  res.json({
    students: assignedStudents,
    courses: database.courses.filter(c => mentorCourseIds.includes(c.id)),
  });
});

apiRouter.post('/mentor/scores', ...requireMentor, (req: AuthenticatedRequest, res: Response) => {
  const { studentId, courseId, assignmentScore, testQuizScore, projectScore, overallGrade, mentorRemarks } = req.body;

  if (!studentId || !courseId) {
    res.status(400).json({ error: 'Student ID and Course ID are required' });
    return;
  }

  const mentor = req.user!;
  const database = db.getDb();

  const now = new Date().toISOString();

  // Update or create latest score snapshot
  let scoreRec = database.scores.find(s => s.studentId === studentId && s.courseId === courseId);
  if (!scoreRec) {
    scoreRec = {
      id: `scr_${Date.now()}`,
      studentId,
      courseId,
      assignmentScore: assignmentScore ?? '0',
      testQuizScore: testQuizScore ?? '0',
      projectScore: projectScore ?? '0',
      attendancePercentage: 'N/A',
      overallGrade: overallGrade ?? 'Pending',
      mentorRemarks: mentorRemarks ?? '',
      updatedAt: now,
      updatedByMentorId: mentor.id,
    };
    database.scores.push(scoreRec);
  } else {
    scoreRec.assignmentScore = assignmentScore ?? scoreRec.assignmentScore;
    scoreRec.testQuizScore = testQuizScore ?? scoreRec.testQuizScore;
    scoreRec.projectScore = projectScore ?? scoreRec.projectScore;
    scoreRec.overallGrade = overallGrade ?? scoreRec.overallGrade;
    scoreRec.mentorRemarks = mentorRemarks ?? scoreRec.mentorRemarks;
    scoreRec.updatedAt = now;
    scoreRec.updatedByMentorId = mentor.id;
  }

  // Append entry to score_history timeline
  const historyEntry: ScoreHistoryEntry = {
    id: `his_${Date.now()}`,
    studentId,
    courseId,
    assignmentScore: scoreRec.assignmentScore,
    testQuizScore: scoreRec.testQuizScore,
    projectScore: scoreRec.projectScore,
    attendancePercentage: 'N/A',
    overallGrade: scoreRec.overallGrade,
    mentorRemarks: scoreRec.mentorRemarks,
    timestamp: now,
    updatedByMentorId: mentor.id,
    updatedByMentorName: mentor.name,
  };
  database.score_history.push(historyEntry);

  db.save();

  res.json({
    message: 'Scores updated successfully',
    scores: scoreRec,
    historyEntry,
  });
});

// ----------------------------------------------------
// 4. STUDENT ROUTES
// ----------------------------------------------------
apiRouter.get('/student/profile', ...requireStudent, (req: AuthenticatedRequest, res: Response) => {
  const student = req.user!;
  const database = db.getDb();

  const enrollment = database.enrollments.find(e => e.studentId === student.id);
  const course = enrollment ? database.courses.find(c => c.id === enrollment.courseId) : null;
  
  const mentorCourseLinks = enrollment ? (database.mentor_courses || []).filter(mc => mc.courseId === enrollment.courseId) : [];
  const mentorIds = mentorCourseLinks.map(mc => mc.mentorId);
  const courseMentors = database.users
    .filter(u => u.role === 'mentor' && mentorIds.includes(u.id))
    .map(m => ({ id: m.id, name: m.name, email: m.email }));

  const score = database.scores.find(sc => sc.studentId === student.id);
  const scoreHistory = database.score_history.filter(sh => sh.studentId === student.id);
  const resume = database.resumes.find(r => r.studentId === student.id);

  res.json({
    portfolio: {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      address: student.address,
      enrolledCourse: course || null,
      assignedMentors: courseMentors,
      assignedMentor: courseMentors.length > 0 ? courseMentors[0] : null,
    },
    scores: score || null,
    scoreHistory: scoreHistory || [],
    resume: resume || null,
  });
});

apiRouter.post('/student/resume', ...requireStudent, upload.single('resume'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No resume file uploaded or invalid file format' });
    return;
  }

  const student = req.user!;
  const database = db.getDb();

  // Overwrite existing resume record if present
  let resumeRec = database.resumes.find(r => r.studentId === student.id);
  if (resumeRec) {
    // Delete old file if exists
    const oldFilePath = path.join(uploadsDir, resumeRec.filename);
    if (fs.existsSync(oldFilePath)) {
      try { fs.unlinkSync(oldFilePath); } catch (e) { /* ignore */ }
    }
    resumeRec.filename = req.file.filename;
    resumeRec.originalName = req.file.originalname;
    resumeRec.mimeType = req.file.mimetype;
    resumeRec.size = req.file.size;
    resumeRec.uploadedAt = new Date().toISOString();
  } else {
    resumeRec = {
      id: `res_${Date.now()}`,
      studentId: student.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
    };
    database.resumes.push(resumeRec);
  }

  db.save();

  res.json({
    message: 'Resume uploaded successfully',
    resume: resumeRec,
  });
});

// Serve uploaded resume files for preview and download
apiRouter.get('/resumes/:filename', (req: Response | any, res: Response) => {
  const rawFilename = req.params.filename;
  const filename = Array.isArray(rawFilename) ? rawFilename[0] : rawFilename;
  const filePath = path.join(uploadsDir, path.basename(filename));

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.txt': 'text/plain; charset=utf-8',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${path.basename(filename)}"`);

  res.sendFile(filePath);
});
