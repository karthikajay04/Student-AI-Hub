// backend/utils/mailer.js
const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is not set. Emails will fail.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Updated helper to send ONLY to your registered email
async function sendMail({ from, to, subject, html }) {
  
  // 1. Without a domain, 'from' MUST be this exact string:
  const realFrom = "onboarding@resend.dev";

  // 2. We override 'to' so it always goes to YOU, regardless of who the app tried to mail
  const myEmail = "classroomsit19@gmail.com";

  const response = await resend.emails.send({
    from: realFrom,
    to: myEmail, // This ensures it bypasses the 403 error
    subject: `[For: ${to}] ${subject}`, // Added the original 'to' in subject so you know who it was for
    html: html,
  });

  return response;
}

module.exports = { sendMail };
