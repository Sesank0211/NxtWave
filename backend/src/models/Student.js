const { randomUUID } = require('crypto');
const { database } = require('../config/db');

function countStudents() {
  return database.prepare('SELECT COUNT(*) AS count FROM students').get().count;
}

function countReferredStudents() {
  return database.prepare("SELECT COUNT(*) AS count FROM students WHERE referredBy IS NOT NULL AND referredBy <> ''").get().count;
}

function countRegisteredSince(since) {
  return database.prepare('SELECT COUNT(*) AS count FROM students WHERE registeredAt >= ?').get(since).count;
}

function countGraduationYear(year) {
  return database.prepare('SELECT COUNT(*) AS count FROM students WHERE graduationYear = ?').get(year).count;
}

function countUniqueColleges() {
  return database.prepare('SELECT COUNT(DISTINCT collegeName) AS count FROM students').get().count;
}

function countReferralsFor(code) {
  return database.prepare('SELECT COUNT(*) AS count FROM students WHERE referredBy = ?').get(code).count;
}

function findStudentByEmail(email) {
  return database.prepare('SELECT * FROM students WHERE email = ? COLLATE NOCASE').get(email) || null;
}

function findStudentByReferralCode(referralCode) {
  return database.prepare('SELECT * FROM students WHERE referralCode = ? COLLATE NOCASE').get(referralCode) || null;
}

function createStudent(student) {
  const now = new Date().toISOString();
  const registeredAt = student.registeredAt || now;
  const id = student.id || randomUUID();
  database.prepare(`
    INSERT INTO students (id, name, email, collegeName, graduationYear, referralCode, referredBy, registeredAt, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    student.name.trim(),
    student.email.trim().toLowerCase(),
    student.collegeName.trim(),
    String(student.graduationYear).trim(),
    student.referralCode.trim().toUpperCase(),
    student.referredBy ? student.referredBy.trim().toUpperCase() : null,
    registeredAt,
    student.createdAt || now,
    student.updatedAt || now,
  );
  return database.prepare('SELECT * FROM students WHERE id = ?').get(id);
}

function listStudents({ search = '', batch = '', referred = '', page = 1, limit = 10 } = {}) {
  const clauses = [];
  const params = [];
  if (search) {
    clauses.push('(name LIKE ? OR email LIKE ? OR collegeName LIKE ? OR referralCode LIKE ? OR referredBy LIKE ?)');
    const pattern = `%${search}%`;
    params.push(pattern, pattern, pattern, pattern, pattern);
  }
  if (batch && batch !== 'all') {
    clauses.push('graduationYear = ?');
    params.push(batch);
  }
  if (referred === 'referred') clauses.push("referredBy IS NOT NULL AND referredBy <> ''");
  if (referred === 'direct') clauses.push("(referredBy IS NULL OR referredBy = '')");
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const total = database.prepare(`SELECT COUNT(*) AS count FROM students ${where}`).get(...params).count;
  const students = database.prepare(`SELECT * FROM students ${where} ORDER BY registeredAt DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, (page - 1) * limit);
  const referralCounts = database.prepare(`
    SELECT referredBy, COUNT(*) AS referralCount FROM students
    WHERE referredBy IS NOT NULL AND referredBy <> '' GROUP BY referredBy
  `).all();
  const countsByCode = new Map(referralCounts.map((row) => [row.referredBy, row.referralCount]));
  return { total, students: students.map((student) => ({ ...student, referralCount: countsByCode.get(student.referralCode) || 0 })) };
}

function countByGraduationYear() {
  return database.prepare('SELECT graduationYear AS batch, COUNT(*) AS count FROM students GROUP BY graduationYear ORDER BY count DESC').all();
}

function countByCollege(limit = 5) {
  return database.prepare('SELECT collegeName AS college, COUNT(*) AS count FROM students GROUP BY collegeName ORDER BY count DESC LIMIT ?').all(limit);
}

function getDailyTimeline(since) {
  return database.prepare(`
    SELECT substr(registeredAt, 1, 10) AS date,
      COUNT(*) AS total,
      SUM(CASE WHEN referredBy IS NOT NULL AND referredBy <> '' THEN 1 ELSE 0 END) AS viral
    FROM students WHERE registeredAt >= ? GROUP BY substr(registeredAt, 1, 10) ORDER BY date ASC
  `).all(since);
}

function getDailyCounts(since) {
  return database.prepare(`
    SELECT substr(registeredAt, 1, 10) AS date, COUNT(*) AS count
    FROM students WHERE registeredAt >= ? GROUP BY substr(registeredAt, 1, 10) ORDER BY date ASC
  `).all(since);
}

function getRecentStudents(limit = 50) {
  return database.prepare('SELECT name, collegeName, graduationYear, referredBy, registeredAt FROM students ORDER BY registeredAt DESC LIMIT ?').all(limit);
}

function getAllStudents() {
  return database.prepare('SELECT * FROM students ORDER BY registeredAt DESC').all();
}

function getPublicLeaderboard(limit = 10) {
  return database.prepare(`
    SELECT referrer.referralCode, referrer.name, referrer.collegeName, referrer.graduationYear,
      COUNT(*) AS referralCount
    FROM students AS referral
    JOIN students AS referrer ON referrer.referralCode = referral.referredBy
    WHERE referral.referredBy IS NOT NULL AND referral.referredBy <> ''
    GROUP BY referral.referredBy
    ORDER BY referralCount DESC, referrer.name ASC
    LIMIT ?
  `).all(limit);
}

function hasStudents() {
  return countStudents() > 0;
}

module.exports = {
  countByCollege,
  countByGraduationYear,
  countRegisteredSince,
  countReferralsFor,
  countReferredStudents,
  countStudents,
  countGraduationYear,
  countUniqueColleges,
  createStudent,
  findStudentByEmail,
  findStudentByReferralCode,
  getAllStudents,
  getDailyCounts,
  getDailyTimeline,
  getPublicLeaderboard,
  getRecentStudents,
  hasStudents,
  listStudents,
};
