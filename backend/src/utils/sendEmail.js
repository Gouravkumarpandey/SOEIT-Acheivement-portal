/**
 * Fast Email Service using Gmail SMTP via Nodemailer
 * Persistent pooled transporter — created once, reused for all emails.
 */
const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    return transporter;
};

// Warm up the SMTP connection at startup so first OTP email is instant
const warmUpEmailTransporter = () => {
    try {
        const t = getTransporter();
        t.verify((err) => {
            if (err) {
                console.warn('⚠️ [EMAIL] Gmail SMTP check failed:', err.message);
                console.warn('   → Make sure EMAIL_USER and EMAIL_PASS are set in .env');
                console.warn('   → EMAIL_PASS must be a Gmail App Password (not your regular password)');
            } else {
                console.log('✅ [EMAIL] Gmail SMTP ready');
            }
        });
    } catch (err) {
        console.warn('⚠️ [EMAIL] Transporter warmup error:', err.message);
    }
};

const sendEmail = async (options) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        console.warn('⚠️ [EMAIL] EMAIL_USER / EMAIL_PASS not set in .env — email not sent');
        console.log('   To:', options.to, '| Subject:', options.subject);
        return;
    }

    try {
        const mailOptions = {
            from: `SOEIT Portal <${user}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.message || 'Please view this email in an HTML-capable viewer.',
        };

        const t = getTransporter();
        const info = await t.sendMail(mailOptions);
        console.log(`✅ [EMAIL] Sent → ${options.to} | ID: ${info.messageId}`);
    } catch (error) {
        console.error(`❌ [EMAIL] Failed to send to ${options.to}:`, error.message);
    }
};

module.exports = sendEmail;
module.exports.warmUpEmailTransporter = warmUpEmailTransporter;
