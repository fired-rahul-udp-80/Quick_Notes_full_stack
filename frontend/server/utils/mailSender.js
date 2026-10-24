const nodemailer = require('nodemailer');


const createMailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS || process.env.MAIL_PASSWORD
    }
  });
};

const sendOTPEmail = async ({ to, subject, purposeText, otp }) => {

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-top: 0; font-size: 24px;">Quick Notes</h2>
      <p style="font-size: 15px; color: #334155;">Hello,</p>
      <p style="font-size: 15px; color: #334155;">${purposeText}:</p>
      <div style="margin: 24px 0; text-align: center;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e1b4b; background: #eef2ff; padding: 12px 24px; border-radius: 8px; border: 1px solid #c7d2fe;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 13px; color: #64748b;">This OTP is valid for <strong>10 minutes</strong>.</p>
      <div style="margin-top: 24px; padding: 12px; background-color: #fff1f2; border-left: 4px solid #f43f5e; border-radius: 4px;">
        <p style="font-size: 12px; color: #9f1239; margin: 0;">
          <strong>Security Warning:</strong> Do not share this OTP with anyone. Quick Notes will never ask for your OTP.
        </p>
      </div>
    </div>
  `;

  try {
    const transporter = createMailTransporter();
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: `Quick Notes - ${subject}`,
      html: htmlContent
    });
  } catch (error) {
    console.error('Failed to dispatch OTP email:', error.message);
  }
};

module.exports = { sendOTPEmail };

