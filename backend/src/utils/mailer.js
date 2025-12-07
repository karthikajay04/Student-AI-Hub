// backend/utils/mailer.js
const nodemailer = require("nodemailer");

// Basic sanity check on env vars (won't print secrets)
console.log("📧 MAILER CONFIG:");
console.log("  MAIL_USER present:", !!process.env.MAIL_USER);
console.log("  MAIL_PASS present:", !!process.env.MAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verify transporter on startup so we see errors in Render logs
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Nodemailer verification failed:", {
      message: err.message,
      code: err.code,
      command: err.command,
    });
  } else {
    console.log("✅ Mailer ready to send emails");
  }
});

module.exports = transporter;
