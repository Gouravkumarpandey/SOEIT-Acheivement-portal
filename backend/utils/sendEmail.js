const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    // Use SMTP if configured, else use Ethereal for testing
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback for testing - logs to console or uses a dummy service
        console.log('--- EMAIL SIMULATION ---');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Body:', options.message);
        console.log('------------------------');
        return;
    }

    const message = {
        from: `${process.env.FROM_NAME || 'SOEIT Portal'} <${process.env.FROM_EMAIL || 'no-reply@soeit.edu.in'}>`,
        to: options.to,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
