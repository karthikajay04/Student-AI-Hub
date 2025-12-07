// backend/utils/mailer.js
const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is not set. Emails will fail.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple helper so the rest of your code stays clean
async function sendMail({ from, to, subject, html }) {
  const realFrom = from || `AI Hub <${process.env.MAIL_USER}>`;

  const response = await resend.emails.send({
    from: realFrom,
    to,
    subject,
    html,
  });

  return response;
}

module.exports = { sendMail };
