const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pool = null;

const getDb = () => {
  if (!pool) throw new Error('Database not initialized. Call connectDB() first.');
  return pool;
};

// Helper: convert positional ? to $1,$2,... for pg
// All queries throughout the codebase use pg's native $1... notation directly.

const initSchema = async (client) => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id              TEXT PRIMARY KEY,
      name            TEXT NOT NULL,
      email           TEXT NOT NULL UNIQUE,
      password        TEXT NOT NULL,
      role            TEXT NOT NULL DEFAULT 'student',
      department      TEXT,
      enrollment_no   TEXT UNIQUE,
      student_id      TEXT,
      phone           TEXT,
      bio             TEXT,
      profile_image   TEXT DEFAULT '',
      batch           TEXT,
      semester        INTEGER,
      section         TEXT,
      is_active       INTEGER DEFAULT 1,
      is_verified     INTEGER DEFAULT 0,
      linked_in       TEXT DEFAULT '',
      github          TEXT DEFAULT '',
      portfolio       TEXT DEFAULT '',
      reset_password_token    TEXT,
      reset_password_expire   TEXT,
      last_login      TEXT,
      edu_10th_school TEXT,
      edu_10th_year   TEXT,
      edu_10th_percent TEXT,
      edu_12th_school TEXT,
      edu_12th_year   TEXT,
      edu_12th_percent TEXT,
      university_name TEXT DEFAULT 'Arka Jain University, Jamshedpur',
      university_cgpa TEXT,
      skills          TEXT,
      created_at      TEXT DEFAULT (NOW()::TEXT),
      updated_at      TEXT DEFAULT (NOW()::TEXT),
      push_token      TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS achievements (
      id              TEXT PRIMARY KEY,
      student_id      TEXT NOT NULL,
      title           TEXT NOT NULL,
      category        TEXT NOT NULL,
      description     TEXT NOT NULL,
      level           TEXT NOT NULL,
      date            TEXT NOT NULL,
      institution     TEXT,
      certificate_url TEXT DEFAULT '',
      proof_files     TEXT DEFAULT '[]',
      status          TEXT DEFAULT 'pending',
      remarks         TEXT,
      verified_by     TEXT,
      verified_at     TEXT,
      is_public       INTEGER DEFAULT 1,
      tags            TEXT DEFAULT '[]',
      points          INTEGER DEFAULT 0,
      created_at      TEXT DEFAULT (NOW()::TEXT),
      updated_at      TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (verified_by) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS verifications (
      id              TEXT PRIMARY KEY,
      achievement_id  TEXT NOT NULL,
      verified_by     TEXT NOT NULL,
      action          TEXT NOT NULL,
      remarks         TEXT,
      previous_status TEXT,
      new_status      TEXT,
      created_at      TEXT DEFAULT (NOW()::TEXT),
      updated_at      TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (achievement_id) REFERENCES achievements(id),
      FOREIGN KEY (verified_by) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      id                  TEXT PRIMARY KEY,
      title               TEXT NOT NULL,
      description         TEXT NOT NULL,
      category            TEXT NOT NULL,
      date                TEXT NOT NULL,
      venue               TEXT NOT NULL,
      registration_link   TEXT,
      created_by          TEXT NOT NULL,
      created_at          TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS notices (
      id              TEXT PRIMARY KEY,
      title           TEXT NOT NULL,
      content         TEXT NOT NULL,
      priority        TEXT DEFAULT 'Medium',
      target_semester TEXT DEFAULT 'all',
      target_branch   TEXT DEFAULT 'all',
      created_by      TEXT NOT NULL,
      created_at      TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS courses (
      id              TEXT PRIMARY KEY,
      student_id      TEXT NOT NULL,
      course_name     TEXT NOT NULL,
      platform        TEXT NOT NULL,
      status          TEXT DEFAULT 'Ongoing',
      progress        INTEGER DEFAULT 0,
      course_link     TEXT DEFAULT '',
      last_synced_at  TEXT,
      sync_credentials TEXT DEFAULT '{}',
      start_date      TEXT,
      completion_date TEXT,
      category        TEXT,
      expected_completion_date TEXT,
      skills_to_be_learnt TEXT,
      certificate_url TEXT,
      created_at      TEXT DEFAULT (NOW()::TEXT),
      updated_at      TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (student_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS hackathons (
      id               TEXT PRIMARY KEY,
      title            TEXT NOT NULL,
      type             TEXT NOT NULL,
      img_url          TEXT,
      prize            TEXT,
      students_count   TEXT,
      deadline_date    TEXT,
      badge            TEXT,
      link             TEXT NOT NULL,
      created_by       TEXT NOT NULL,
      created_at       TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS hackathon_activities (
      id               TEXT PRIMARY KEY,
      student_id       TEXT NOT NULL,
      hackathon_title  TEXT NOT NULL,
      action_type      TEXT NOT NULL DEFAULT 'visit',
      created_at       TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (student_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS files (
      id               TEXT PRIMARY KEY,
      filename         TEXT NOT NULL,
      mimetype         TEXT NOT NULL,
      data             BYTEA NOT NULL,
      created_at       TEXT DEFAULT (NOW()::TEXT)
    )`,
    `CREATE TABLE IF NOT EXISTS internships (
      id               TEXT PRIMARY KEY,
      student_id       TEXT NOT NULL,
      company_name     TEXT NOT NULL,
      role             TEXT NOT NULL,
      start_date       TEXT,
      end_date         TEXT,
      status           TEXT DEFAULT 'Ongoing',
      description      TEXT,
      certificate_url  TEXT,
      location         TEXT,
      internship_type  TEXT,
      created_at       TEXT DEFAULT (NOW()::TEXT),
      updated_at       TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (student_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS internship_postings (
      id               TEXT PRIMARY KEY,
      company_name     TEXT NOT NULL,
      role             TEXT NOT NULL,
      location         TEXT,
      stipend          TEXT,
      deadline         TEXT,
      description      TEXT,
      requirements     TEXT,
      apply_link       TEXT,
      created_by       TEXT NOT NULL,
      created_at       TEXT DEFAULT (NOW()::TEXT),
      updated_at       TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS projects (
      id               TEXT PRIMARY KEY,
      student_id       TEXT NOT NULL,
      title            TEXT NOT NULL,
      description      TEXT NOT NULL,
      github_link      TEXT,
      live_link        TEXT,
      tech_stack       TEXT,
      status           TEXT DEFAULT 'Completed',
      created_at       TEXT DEFAULT (NOW()::TEXT),
      updated_at       TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (student_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      type        TEXT NOT NULL,
      title       TEXT NOT NULL,
      message     TEXT NOT NULL,
      link        TEXT,
      is_read     INTEGER DEFAULT 0,
      created_at  TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS badges (
      id              TEXT PRIMARY KEY,
      student_id      TEXT NOT NULL,
      badge_type      TEXT NOT NULL,
      week_start      TEXT NOT NULL,
      points_earned   INTEGER DEFAULT 0,
      created_at      TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (student_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS course_assignments (
      id              TEXT PRIMARY KEY,
      course_name     TEXT NOT NULL,
      subject         TEXT NOT NULL,
      description     TEXT,
      course_link     TEXT DEFAULT '',
      department      TEXT NOT NULL,
      semester        INTEGER NOT NULL,
      assigned_by     TEXT NOT NULL,
      created_at      TEXT DEFAULT (NOW()::TEXT),
      updated_at      TEXT DEFAULT (NOW()::TEXT),
      FOREIGN KEY (assigned_by) REFERENCES users(id)
    )`,
    // Indexes
    `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`,
    `CREATE INDEX IF NOT EXISTS idx_users_dept ON users(department)`,
    `CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)`,
    `CREATE INDEX IF NOT EXISTS idx_users_batch ON users(batch)`,
    `CREATE INDEX IF NOT EXISTS idx_users_auth_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_users_auth_enroll ON users(enrollment_no)`,
    `CREATE INDEX IF NOT EXISTS idx_achievements_student_status ON achievements(student_id, status)`,
    `CREATE INDEX IF NOT EXISTS idx_achievements_public_status ON achievements(is_public, status)`,
    `CREATE INDEX IF NOT EXISTS idx_achievements_category_status ON achievements(category, status)`,
    `CREATE INDEX IF NOT EXISTS idx_notices_author ON notices(created_by)`,
    `CREATE INDEX IF NOT EXISTS idx_courses_student ON courses(student_id)`,
    `CREATE INDEX IF NOT EXISTS idx_projects_student ON projects(student_id)`,
    `CREATE INDEX IF NOT EXISTS idx_internships_student ON internships(student_id)`,
    `CREATE INDEX IF NOT EXISTS idx_events_author ON events(created_by)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read)`,
    `CREATE INDEX IF NOT EXISTS idx_course_assignments_dept_sem ON course_assignments(department, semester)`,
    `CREATE INDEX IF NOT EXISTS idx_course_assignments_faculty ON course_assignments(assigned_by)`,
    `CREATE INDEX IF NOT EXISTS idx_files_created ON files(created_at)`,
  ];

  for (const sql of queries) {
    try {
      await client.query(sql);
    } catch (err) {
      // Log unexpected errors but don't crash on "already exists"
      if (!err.message.includes('already exists')) {
        console.warn('⚠️ Schema warning:', err.message);
      }
    }
  }

  // Migrations for existing systems
  const migrations = [
    `ALTER TABLE course_assignments ADD COLUMN IF NOT EXISTS course_link TEXT DEFAULT ''`,
    `ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_link TEXT DEFAULT ''`,
    `ALTER TABLE courses ADD COLUMN IF NOT EXISTS last_synced_at TEXT`,
    `ALTER TABLE courses ADD COLUMN IF NOT EXISTS sync_credentials TEXT DEFAULT '{}'`,
    `ALTER TABLE courses ADD COLUMN IF NOT EXISTS category TEXT`,
    `ALTER TABLE courses ADD COLUMN IF NOT EXISTS expected_completion_date TEXT`,
    `ALTER TABLE courses ADD COLUMN IF NOT EXISTS skills_to_be_learnt TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS edu_10th_school TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS edu_10th_year TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS edu_10th_percent TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS edu_12th_school TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS edu_12th_year TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS edu_12th_percent TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS university_name TEXT DEFAULT 'Arka Jain University, Jamshedpur'`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS university_cgpa TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token TEXT`,
    `ALTER TABLE users ALTER COLUMN department DROP NOT NULL`,
  ];

  for (const sql of migrations) {
    try {
      await client.query(sql);
    } catch (err) {
      // Ignore errors (column already exists, etc.)
    }
  }
  console.log('✅ Migration checks completed');
};

const seedDemoUsers = async (client) => {
  const demoUsers = [
    { name: 'Demo Student', email: 'student@soeit.ac.in', enrollmentNo: 'AJU/221403', password: 'Test@123', role: 'student', department: 'CSE', batch: '2022', semester: 4 },
    { name: 'Demo Faculty', email: 'faculty@soeit.ac.in', enrollmentNo: 'AJU/FACULTY', password: 'Faculty@123', role: 'faculty', department: 'CSE' },
    { name: 'System Admin', email: 'admin@soeit.ac.in', enrollmentNo: 'AJU/ADMIN', password: 'Admin@123', role: 'admin', department: 'Other' },
  ];

  for (const u of demoUsers) {
    try {
      const existing = await client.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (!existing.rows || existing.rows.length === 0) {
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(u.password, salt);
        const id = Math.random().toString(36).substring(2, 15);
        await client.query(
          `INSERT INTO users (id, name, email, password, role, department, enrollment_no, batch, semester, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1)`,
          [id, u.name, u.email, hashed, u.role, u.department, u.enrollmentNo, u.batch || null, u.semester || null]
        );
        console.log(`👤 Demo ${u.role} created (${u.enrollmentNo})`);
      } else {
        console.log(`🔄 Demo ${u.role} already exists, skipping.`);
      }
    } catch (err) {
      console.error(`❌ Error seeding user ${u.email}:`, err.message);
    }
  }
};

const seedHackathons = async (client) => {
  try {
    const countRes = await client.query('SELECT COUNT(*) as cnt FROM hackathons');
    const count = Number(countRes.rows[0]?.cnt || 0);
    if (count > 0) return;

    const adminRes = await client.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (!adminRes.rows || adminRes.rows.length === 0) return;

    const adminId = adminRes.rows[0].id;
    if (!adminId) return;

    const hacks = [
      { title: 'Smart India Hackathon 2026', type: 'Govt of India', prize: '₹1,00,000', badge: 'Premier', link: 'https://www.sih.gov.in/', deadline: 'Aug 2026' },
      { title: 'Google AI Challenge 2026', type: 'AI / ML', prize: '$50,000', badge: 'AI', link: 'https://ai.google/challenges/', deadline: 'Mar 2026' },
      { title: 'MLH Global Hackathon 2026', type: 'Web Development', prize: '$20,000', badge: 'Web', link: 'https://mlh.io/', deadline: 'Rolling' }
    ];

    for (const h of hacks) {
      const hackId = 'hack_' + Math.random().toString(36).substring(2, 10);
      await client.query(
        `INSERT INTO hackathons (id, title, type, prize, badge, link, deadline_date, created_by, students_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [hackId, h.title, h.type, h.prize, h.badge, h.link, h.deadline, adminId, '10k+']
      );
    }
  } catch (err) {
    console.log('⚠️ Hackathon seeding skipped:', err.message);
  }
};

const awardBadgesForExistingData = async (client) => {
  try {
    const { startOfWeek, format } = require('date-fns');

    const achievementsRes = await client.query(`
      SELECT a.student_id, MAX(a.date) as date, SUM(a.points) as weekly_points, u.name, u.email
      FROM achievements a
      JOIN users u ON a.student_id = u.id
      WHERE a.status = 'approved'
      GROUP BY a.student_id, u.name, u.email
      ORDER BY MAX(a.date) DESC
    `);

    if (!achievementsRes.rows || achievementsRes.rows.length === 0) {
      console.log('📊 No approved achievements found in database');
      return;
    }

    const BADGE_TIERS = [
      { type: 'Platinum', minPoints: 500 },
      { type: 'Gold', minPoints: 300 },
      { type: 'Silver', minPoints: 150 },
      { type: 'Bronze', minPoints: 50 }
    ];

    const weeklyData = {};

    for (const row of achievementsRes.rows) {
      const studentId = row.student_id;
      const achievementDate = row.date;
      const points = Number(row.weekly_points || 0);
      const studentName = row.name;
      const studentEmail = row.email;

      const weekStart = format(startOfWeek(new Date(achievementDate)), 'yyyy-MM-dd');
      const key = `${studentId}_${weekStart}`;

      if (!weeklyData[key]) {
        weeklyData[key] = { studentId, weekStart, studentName, studentEmail, totalPoints: 0 };
      }
      weeklyData[key].totalPoints += points;
    }

    let badgesAwarded = 0;

    for (const key in weeklyData) {
      const data = weeklyData[key];
      const { studentId, weekStart, studentName, totalPoints } = data;

      const existingRes = await client.query(
        'SELECT id FROM badges WHERE student_id = $1 AND week_start = $2',
        [studentId, weekStart]
      );

      if (existingRes.rows.length > 0) continue;

      const tier = BADGE_TIERS.find(t => totalPoints >= t.minPoints);
      if (!tier) continue;

      const badgeId = 'badge_' + Math.random().toString(36).substring(2, 10);
      await client.query(
        `INSERT INTO badges (id, student_id, badge_type, week_start, points_earned, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [badgeId, studentId, tier.type, weekStart, totalPoints, new Date().toISOString()]
      );
      badgesAwarded++;
    }

    console.log(`✅ ${badgesAwarded} badges awarded from historical data`);
  } catch (err) {
    console.error('❌ Badge awarding error:', err.message);
  }
};

const connectDB = async () => {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Test connection
    const testClient = await pool.connect();
    await testClient.query('SELECT 1');
    testClient.release();
    console.log('✅ NeonDB (PostgreSQL) Connected');

    await initSchema(pool);
    console.log('📐 Schema initialized');

    await seedDemoUsers(pool);
    await seedHackathons(pool);
    await awardBadgesForExistingData(pool);

    return pool;
  } catch (error) {
    console.error('❌ NeonDB Connection Failed:', error.message);
    throw error;
  }
};

module.exports = { connectDB, getDb };
