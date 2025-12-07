// backend/routes/contact.js
const express = require("express");
const router = express.Router();
const { sendMail } = require("../utils/mailer");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("📩 Incoming contact request:", { name, email });

    if (!name || !email || !message) {
      console.warn("⚠️ Contact validation failed – missing fields");
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 1️⃣ Send email to Admin
    console.log("📨 Sending admin email via Resend...");
    await sendMail({
      to: process.env.MAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });
    console.log("✅ Admin email sent successfully");

    // 2️⃣ Send auto-reply to User
    console.log("📨 Sending auto-reply to user via Resend...");
    await sendMail({
      to: email,
      subject: "We received your message — AI Hub",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting <b>AI Hub</b>. Your message has been received.</p>
        <p>We will get back to you shortly.</p>
        <br />
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <br />
        <p>Best regards,<br>AI Hub Team</p>
      `,
    });
    console.log("✅ Auto-reply email sent successfully");

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("❌ Contact mail error (Resend):", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

module.exports = router;
