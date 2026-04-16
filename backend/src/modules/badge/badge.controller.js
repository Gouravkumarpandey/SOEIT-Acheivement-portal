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
        const now = new Date();
        const weekStart = format(startOfWeek(now), 'yyyy-MM-dd');
        const weekEnd = format(endOfWeek(now), 'yyyy-MM-dd');

        // Get points for all students in the current week (only approved ones)
        const pointsRes = await db.execute({
            sql: `SELECT a.student_id, SUM(a.points) as weekly_points, u.name, u.email
                  FROM achievements a
                  JOIN users u ON a.student_id = u.id
                  WHERE a.status = 'approved' AND a.date >= ? AND a.date <= ?
                  GROUP BY a.student_id`,
            args: [weekStart, weekEnd]
        });

        const awards = [];
        for (const row of pointsRes.rows) {
            const studentId = row.student_id;
            const points = Number(row.weekly_points);
            const studentName = row.name;
            const studentEmail = row.email;

            // Check if user already has a badge for this week
            const alreadyHas = await Badge.hasBadgeForWeek(studentId, weekStart);
            if (alreadyHas) continue;

            // Determine badge type
            const tier = BADGE_TIERS.find(t => points >= t.minPoints);
            if (tier) {
                await Badge.create({
                    studentId,
                    badgeType: tier.type,
                    weekStart,
                    pointsEarned: points
                });
                awards.push({ studentId, badgeType: tier.type, points });

                // Send professional email notification
                const htmlTemplate = getEmailTemplate({
                    title: 'Congratulations! You Earned a Weekly Badge 🏆',
                    preheader: 'Your hard work has been recognized on the SOEIT Portal.',
                    content: `
                        <h1 class="h1">Outstanding Performance, ${studentName}!</h1>
                        <p class="p">We are thrilled to inform you that your verified achievements from the past week have earned you the prestigious <strong style="color: #002147;">${tier.type} Badge</strong>!</p>
                        <p class="p">You accumulated a total of <strong>${points} real verified points</strong> this week.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #e2e8f0;">
                            <h2 style="margin: 0; color: #f59e0b; font-size: 24px;">🏆 ${tier.type} Scholar</h2>
                            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Week starting: ${weekStart}</p>
                        </div>
                        <p class="p">Your badge is now publicly visible on your <strong>Public Portfolio</strong>. This is a testament to your continuous effort and dedication.</p>
                    `,
                    actionUrl: `${process.env.CLIENT_URL || 'https://soeit-acheivement-portal.vercel.app'}/portfolio/${studentId}`,
                    actionText: 'View Your Public Portfolio',
                    footerText: 'Keep up the excellent work! Standard verification metrics applied.'
                });

                // Send email
                await sendEmail({
                    to: studentEmail,
                    subject: `🏆 You earned the ${tier.type} Badge this week!`,
                    html: htmlTemplate
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Awarded ${awards.length} badges for week starting ${weekStart}`,
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
        const now = new Date();
        const weekStart = format(startOfWeek(now), 'yyyy-MM-dd');
        const leaderboard = await Badge.getWeeklyTop(weekStart);
        res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
