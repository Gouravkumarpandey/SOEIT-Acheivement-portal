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
        
        // ✅ FIXED: Get all approved achievements and group by week in JavaScript
        // (LibSQL/Turso may not support complex date functions)
        const pointsRes = await db.execute(`
            SELECT 
                a.student_id,
                a.verified_at,
                a.points,
                u.name,
                u.email
            FROM achievements a
            JOIN users u ON a.student_id = u.id
            WHERE a.status = 'approved'
            AND a.points > 0
            AND a.verified_at IS NOT NULL
            ORDER BY a.verified_at DESC
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

        // Group by student and week in JavaScript
        const weeklyData = {};
        
        for (const row of pointsRes.rows) {
            const studentId = row.student_id || row[0];
            const verifiedAt = new Date(row.verified_at || row[1]);
            const points = Number(row.points || row[2] || 0);
            const studentName = row.name || row[3];
            const studentEmail = row.email || row[4];

            // Calculate week start (Monday of that week)
            const weekStart = new Date(verifiedAt);
            const day = weekStart.getDay();
            const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
            weekStart.setDate(diff);
            weekStart.setHours(0, 0, 0, 0);
            
            const weekStartStr = weekStart.toISOString().split('T')[0];
            const key = `${studentId}_${weekStartStr}`;

            if (!weeklyData[key]) {
                weeklyData[key] = {
                    studentId,
                    weekStart: weekStartStr,
                    studentName,
                    studentEmail,
                    totalPoints: 0
                };
            }
            weeklyData[key].totalPoints += points;
        }

        const awards = [];

        // Award badges - one per student per week
        for (const key in weeklyData) {
            const data = weeklyData[key];
            const { studentId, weekStart, studentName, totalPoints } = data;

            // Check if badge already exists for this week
            const existingRes = await db.execute(
                'SELECT id FROM badges WHERE student_id = ? AND week_start = ?',
                [studentId, weekStart]
            );

            if (existingRes?.rows?.length > 0) {
                console.log(`⏭️ Badge already exists for ${studentName} in week ${weekStart}`);
                continue;
            }

            const tier = BADGE_TIERS.find(t => totalPoints >= t.minPoints);
            if (!tier) {
                console.log(`⚠️ No tier found for ${studentName} with ${totalPoints} points`);
                continue;
            }

            const badgeId = Math.random().toString(36).substring(2, 15);
            await db.execute({
                sql: `INSERT INTO badges (id, student_id, badge_type, week_start, points_earned, created_at)
                      VALUES (?, ?, ?, ?, ?, datetime('now'))`,
                args: [badgeId, studentId, tier.type, weekStart, totalPoints]
            });

            awards.push({ 
                studentId, 
                badgeType: tier.type, 
                points: totalPoints,
                week: weekStart,
                studentName 
            });

            console.log(`✅ Badge awarded: ${studentName} - ${tier.type} (${totalPoints} pts) for week ${weekStart}`);
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
        
        // Get week start and end
        const weekStart = new Date(now);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        const weekStartStr = weekStart.toISOString().split('T')[0];
        const weekEndStr = weekEnd.toISOString().split('T')[0];
        
        // ✅ FIXED: Simplified query for LibSQL/Turso compatibility
        const leaderboardRes = await db.execute(`
            SELECT 
                u.id,
                u.name,
                u.profile_image,
                u.department,
                SUM(a.points) as points_earned,
                COUNT(a.id) as achievement_count
            FROM achievements a
            JOIN users u ON a.student_id = u.id
            WHERE a.status = 'approved'
            AND a.points > 0
            AND a.verified_at IS NOT NULL
            AND DATE(a.verified_at) >= ?
            AND DATE(a.verified_at) <= ?
            GROUP BY u.id, u.name, u.profile_image, u.department
            HAVING SUM(a.points) >= 50
            ORDER BY SUM(a.points) DESC, u.name ASC
            LIMIT 10
        `, [weekStartStr, weekEndStr]);
        
        const leaderboard = (leaderboardRes?.rows || []).map((row, idx) => ({
            id: row.id || row[0],
            student_id: row.id || row[0],
            name: row.name || row[1],
            profile_image: row.profile_image || row[2],
            department: row.department || row[3],
            points_earned: Number(row.points_earned || row[4]) || 0,
            achievement_count: Number(row.achievement_count || row[5]) || 0,
            badge_type: (() => {
                const pts = Number(row.points_earned || row[4]) || 0;
                if (pts >= 500) return 'Platinum';
                if (pts >= 300) return 'Gold';
                if (pts >= 150) return 'Silver';
                if (pts >= 50) return 'Bronze';
                return 'None';
            })(),
            week_start: weekStartStr,
        }));
        
        res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
