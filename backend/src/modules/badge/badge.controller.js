const Badge = require('./badge.model');
const { getDb } = require('../../config/db');
const { startOfWeek, endOfWeek, format } = require('date-fns');
const sendEmail = require('../../utils/sendEmail');
const getEmailTemplate = require('../../utils/emailTemplates');

/**
 * Logic for awarding badges based on weekly points
 * - Bronze: 50+ points
 * - Silver: 150+ points
 * - Gold: 300+ points
 * - Platinum: 500+ points
 */
const BADGE_TIERS = [
    { type: 'Platinum', minPoints: 500 },
    { type: 'Gold', minPoints: 300 },
    { type: 'Silver', minPoints: 150 },
    { type: 'Bronze', minPoints: 50 }
];

exports.awardWeeklyBadges = async (req, res) => {
    try {
        const db = getDb();
        
        // Get ALL approved achievements grouped by week
        const pointsRes = await db.execute(`
            SELECT a.student_id, DATE(a.date) as ach_date, SUM(a.points) as daily_points, u.name, u.email
            FROM achievements a
            JOIN users u ON a.student_id = u.id
            WHERE a.status = 'approved'
            GROUP BY a.student_id, DATE(a.date)
            ORDER BY a.date DESC
        `);

        if (!pointsRes?.rows || pointsRes.rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No approved achievements found to award badges',
                awards: []
            });
        }

        const BADGE_TIERS = [
            { type: 'Platinum', minPoints: 500 },
            { type: 'Gold', minPoints: 300 },
            { type: 'Silver', minPoints: 150 },
            { type: 'Bronze', minPoints: 50 }
        ];

        // Group by student and week
        const weeklyData = {};
        
        for (const row of pointsRes.rows) {
            const studentId = row.student_id || row[0];
            const achievementDate = row.ach_date || row[1];
            const points = Number(row.daily_points || row[2] || 0);
            const studentName = row.name || row[3];
            const studentEmail = row.email || row[4];

            const weekStart = format(startOfWeek(new Date(achievementDate)), 'yyyy-MM-dd');
            const key = `${studentId}_${weekStart}`;

            if (!weeklyData[key]) {
                weeklyData[key] = {
                    studentId,
                    weekStart,
                    studentName,
                    studentEmail,
                    totalPoints: 0
                };
            }
            weeklyData[key].totalPoints += points;
        }

        const awards = [];

        // Award badges for each week
        for (const key in weeklyData) {
            const data = weeklyData[key];
            const { studentId, weekStart, studentName, totalPoints } = data;

            // Check if badge already exists
            const existingRes = await db.execute(
                'SELECT id FROM badges WHERE student_id = ? AND week_start = ?',
                [studentId, weekStart]
            );

            if (existingRes?.rows?.length > 0) continue;

            const tier = BADGE_TIERS.find(t => totalPoints >= t.minPoints);
            if (!tier) continue;

            const badgeId = Math.random().toString(36).substring(2, 15);
            await db.execute({
                sql: `INSERT INTO badges (id, student_id, badge_type, week_start, points_earned)
                      VALUES (?, ?, ?, ?, ?)`,
                args: [badgeId, studentId, tier.type, weekStart, totalPoints]
            });

            awards.push({ 
                studentId, 
                badgeType: tier.type, 
                points: totalPoints,
                week: weekStart,
                studentName 
            });
        }

        res.status(200).json({
            success: true,
            message: `Recalculated and awarded ${awards.length} badges across all weeks`,
            awards
        });
    } catch (error) {
        console.error('Badge award error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStudentBadges = async (req, res) => {
    try {
        const { studentId } = req.params;
        const badges = await Badge.findByStudent(studentId);
        res.status(200).json({ success: true, data: badges });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getWeeklyLeaderboard = async (req, res) => {
    try {
        const db = getDb();
        const now = new Date();
        const weekStart = format(startOfWeek(now), 'yyyy-MM-dd');
        
        // Try to get badges for current week first
        let leaderboard = await Badge.getWeeklyTop(weekStart);
        
        // If no badges for current week, get the most recent week with badges
        if (!leaderboard || leaderboard.length === 0) {
            const recentRes = await db.execute(`
                SELECT DISTINCT week_start FROM badges 
                ORDER BY week_start DESC 
                LIMIT 1
            `);
            
            if (recentRes?.rows?.length > 0) {
                const recentWeek = recentRes.rows[0].week_start || recentRes.rows[0][0];
                leaderboard = await Badge.getWeeklyTop(recentWeek);
            }
        }
        
        res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
