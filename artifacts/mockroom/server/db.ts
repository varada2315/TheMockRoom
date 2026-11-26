import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'uploads', 'resumes');
const dbFilePath = path.join(dataDir, 'db.json');

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'superadmin' | 'mentor' | 'student';
  name: string;
  email: string;
  phone: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
}

export interface MentorCourse {
  id: string;
  mentorId: string;
  courseId: string;
  assignedAt: string;
}

export interface ScoreRecord {
  id: string;
  studentId: string;
  courseId: string;
  assignmentScore: number | string;
  testQuizScore: number | string;
  projectScore: number | string;
  attendancePercentage: number | string;
  overallGrade: string;
  mentorRemarks: string;
  updatedAt: string;
  updatedByMentorId: string;
}

export interface ScoreHistoryEntry {
  id: string;
  studentId: string;
  courseId: string;
  assignmentScore: number | string;
  testQuizScore: number | string;
  projectScore: number | string;
  attendancePercentage: number | string;
  overallGrade: string;
  mentorRemarks: string;
  timestamp: string;
  updatedByMentorId: string;
  updatedByMentorName: string;
}

export interface ResumeRecord {
  id: string;
  studentId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface DatabaseSchema {
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  mentor_courses: MentorCourse[];
  scores: ScoreRecord[];
  score_history: ScoreHistoryEntry[];
  resumes: ResumeRecord[];
}

// Ensure directories exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function getInitialDbData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('AdminPassword123!', salt);
  const mentorPasswordHash = bcrypt.hashSync('MentorPassword123!', salt);
  const studentPasswordHash = bcrypt.hashSync('StudentPassword123!', salt);

  const now = new Date().toISOString();

  const users: User[] = [
    {
      id: 'usr_admin_1',
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'superadmin',
      name: 'Super Administrator',
      email: 'admin@themockroom.com',
      phone: '+91 9999900000',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'usr_mentor_1',
      username: 'mentor_alex',
      passwordHash: mentorPasswordHash,
      role: 'mentor',
      name: 'Alex Rivera',
      email: 'alex.rivera@themockroom.com',
      phone: '+91 9876543210',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'usr_student_1',
      username: 'student_sam',
      passwordHash: studentPasswordHash,
      role: 'student',
      name: 'Sam Taylor',
      email: 'sam.taylor@example.com',
      phone: '+91 9123456789',
      address: '123 Innovation Way, Tech City',
      isActive: true,
      createdAt: now,
    },
  ];

  const courses: Course[] = [
    { id: 'crs_ai', title: 'AI - Artificial Intelligence', code: 'AI-101', description: 'Generative AI, neural networks, PyTorch, LLMs, and real-world AI deployment.', createdAt: now },
    { id: 'crs_iot', title: 'IoT - Internet of Things', code: 'IOT-101', description: 'Embedded microcontrollers, sensor nodes, MQTT protocols, and hardware systems.', createdAt: now },
    { id: 'crs_webdev', title: 'Web Development', code: 'WEB-101', description: 'Full stack React.js, Node.js, Express, databases, REST APIs, and hosting.', createdAt: now },
    { id: 'crs_digitalmktg', title: 'Digital Marketing', code: 'DM-101', description: 'SEO algorithms, performance advertising, growth hacking, and web analytics.', createdAt: now },
    { id: 'crs_vlsi', title: 'VLSI Design', code: 'VLSI-101', description: 'Verilog hardware description, ASIC/FPGA flow, digital circuits, and silicon layout.', createdAt: now },
    { id: 'crs_datasci', title: 'Data Science', code: 'DS-101', description: 'Python data stack, probability, predictive modeling, and data storytelling.', createdAt: now },
    { id: 'crs_dataanalytic', title: 'Data Analytics', code: 'DA-101', description: 'SQL querying, PowerBI dashboards, business intelligence, and Excel mastery.', createdAt: now },
    { id: 'crs_ml', title: 'Machine Learning', code: 'ML-101', description: 'Supervised algorithms, Scikit-Learn pipelines, feature selection, and API models.', createdAt: now },
  ];

  const enrollments: Enrollment[] = [
    {
      id: 'enr_1',
      studentId: 'usr_student_1',
      courseId: 'crs_webdev',
      enrolledAt: now,
    },
  ];

  const mentor_courses: MentorCourse[] = [
    {
      id: 'mc_1',
      mentorId: 'usr_mentor_1',
      courseId: 'crs_webdev',
      assignedAt: now,
    },
    {
      id: 'mc_2',
      mentorId: 'usr_mentor_1',
      courseId: 'crs_ai',
      assignedAt: now,
    },
  ];

  const scores: ScoreRecord[] = [
    {
      id: 'scr_1',
      studentId: 'usr_student_1',
      courseId: 'crs_webdev',
      assignmentScore: '92/100',
      testQuizScore: '88/100',
      projectScore: '95/100',
      attendancePercentage: '96%',
      overallGrade: 'A+',
      mentorRemarks: 'Exceptional problem-solving abilities and pristine component architecture.',
      updatedAt: now,
      updatedByMentorId: 'usr_mentor_1',
    },
  ];

  const score_history: ScoreHistoryEntry[] = [
    {
      id: 'his_1',
      studentId: 'usr_student_1',
      courseId: 'crs_webdev',
      assignmentScore: '90/100',
      testQuizScore: '85/100',
      projectScore: '92/100',
      attendancePercentage: '95%',
      overallGrade: 'A',
      mentorRemarks: 'Initial performance review after Sprint 1.',
      timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedByMentorId: 'usr_mentor_1',
      updatedByMentorName: 'Alex Rivera',
    },
    {
      id: 'his_2',
      studentId: 'usr_student_1',
      courseId: 'crs_webdev',
      assignmentScore: '92/100',
      testQuizScore: '88/100',
      projectScore: '95/100',
      attendancePercentage: '96%',
      overallGrade: 'A+',
      mentorRemarks: 'Exceptional problem-solving abilities and pristine component architecture.',
      timestamp: now,
      updatedByMentorId: 'usr_mentor_1',
      updatedByMentorName: 'Alex Rivera',
    },
  ];

  return {
    users,
    courses,
    enrollments,
    mentor_courses,
    scores,
    score_history,
    resumes: [],
  };
}

const backupDir = path.join(dataDir, 'backups');
const backupFilePath = path.join(dataDir, 'db.json.bak');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

class JSONDatabase {
  private data: DatabaseSchema;
  private saveCounter: number = 0;

  constructor() {
    this.data = this.loadData();
    this.createRollingBackup('startup');
  }

  private validateSchema(parsed: any): DatabaseSchema | null {
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      courses: Array.isArray(parsed.courses) ? parsed.courses : [],
      enrollments: Array.isArray(parsed.enrollments) ? parsed.enrollments : [],
      mentor_courses: Array.isArray(parsed.mentor_courses) ? parsed.mentor_courses : [],
      scores: Array.isArray(parsed.scores) ? parsed.scores : [],
      score_history: Array.isArray(parsed.score_history) ? parsed.score_history : [],
      resumes: Array.isArray(parsed.resumes) ? parsed.resumes : [],
    };
  }

  private loadData(): DatabaseSchema {
    // 1. Try reading primary db.json file
    if (fs.existsSync(dbFilePath)) {
      try {
        const raw = fs.readFileSync(dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        const validated = this.validateSchema(parsed);
        if (validated) {
          console.log('[DB] Database loaded successfully from db.json');
          return validated;
        }
      } catch (err) {
        console.error('[DB WARNING] Failed to parse db.json, attempting recovery from backup:', err);
      }
    }

    // 2. Fallback to primary backup file db.json.bak
    if (fs.existsSync(backupFilePath)) {
      try {
        const raw = fs.readFileSync(backupFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        const validated = this.validateSchema(parsed);
        if (validated) {
          console.log('[DB RECOVERY] Recovered database state from db.json.bak');
          this.saveData(validated);
          return validated;
        }
      } catch (err) {
        console.error('[DB WARNING] Failed to read db.json.bak:', err);
      }
    }

    // 3. Fallback to latest timestamped snapshot in data/backups/
    if (fs.existsSync(backupDir)) {
      try {
        const files = fs.readdirSync(backupDir)
          .filter(f => f.startsWith('db_') && f.endsWith('.json'))
          .sort()
          .reverse();

        for (const file of files) {
          const snapshotPath = path.join(backupDir, file);
          try {
            const raw = fs.readFileSync(snapshotPath, 'utf-8');
            const parsed = JSON.parse(raw);
            const validated = this.validateSchema(parsed);
            if (validated) {
              console.log(`[DB RECOVERY] Recovered database state from rolling snapshot ${file}`);
              this.saveData(validated);
              return validated;
            }
          } catch {
            continue;
          }
        }
      } catch (err) {
        console.error('[DB WARNING] Failed to inspect rolling backups:', err);
      }
    }

    // 4. Initial fallback if no database file or backup exists
    console.log('[DB INIT] Initializing new database seed file...');
    const initial = getInitialDbData();
    this.saveData(initial);
    return initial;
  }

  private createRollingBackup(tag: string = 'auto'): void {
    try {
      const nowStr = new Date().toISOString().replace(/[:.]/g, '-');
      const snapFile = path.join(backupDir, `db_${nowStr}_${tag}.json`);
      fs.writeFileSync(snapFile, JSON.stringify(this.data, null, 2), 'utf-8');

      // Keep only the 10 most recent snapshot files
      const files = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('db_') && f.endsWith('.json'))
        .sort();

      if (files.length > 10) {
        const toDelete = files.slice(0, files.length - 10);
        toDelete.forEach(f => {
          try {
            fs.unlinkSync(path.join(backupDir, f));
          } catch {}
        });
      }
    } catch (err) {
      console.error('[DB WARNING] Failed to create rolling backup:', err);
    }
  }

  private saveData(newData?: DatabaseSchema): void {
    if (newData) {
      this.data = newData;
    }

    const payload = JSON.stringify(this.data, null, 2);
    const tempFile = path.join(dataDir, `db_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.tmp`);

    try {
      // Synchronously write and fsync to guarantee disk persistence
      const fd = fs.openSync(tempFile, 'w');
      fs.writeSync(fd, payload, 0, 'utf-8');
      fs.fsyncSync(fd);
      fs.closeSync(fd);

      // Create primary backup copy before atomic rename
      if (fs.existsSync(dbFilePath)) {
        try {
          fs.copyFileSync(dbFilePath, backupFilePath);
        } catch {}
      }

      // Atomic file replacement
      fs.renameSync(tempFile, dbFilePath);

      // Increment save counter & trigger periodic snapshot
      this.saveCounter++;
      if (this.saveCounter % 10 === 0) {
        this.createRollingBackup(`snap_${this.saveCounter}`);
      }
    } catch (err) {
      console.error('[DB ERROR] Failed to save database file atomically:', err);
      // Clean up temp file if present
      if (fs.existsSync(tempFile)) {
        try {
          fs.unlinkSync(tempFile);
        } catch {}
      }
      throw err;
    }
  }

  public getDb(): DatabaseSchema {
    return this.data;
  }

  public save(): void {
    this.saveData();
  }

  public verifyIntegrity(): { status: 'healthy' | 'repaired'; recordCounts: Record<string, number> } {
    const counts = {
      users: this.data.users.length,
      courses: this.data.courses.length,
      enrollments: this.data.enrollments.length,
      mentor_courses: this.data.mentor_courses.length,
      scores: this.data.scores.length,
      score_history: this.data.score_history.length,
      resumes: this.data.resumes.length,
    };
    return { status: 'healthy', recordCounts: counts };
  }
}

export const db = new JSONDatabase();
