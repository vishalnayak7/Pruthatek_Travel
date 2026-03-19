import nodemailer from "nodemailer";

export const sendResetPasswordOtp = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Traguin Travel" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your password - Traguin Travel",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">

        <h2 style="color: #2c3e50;">🌍 Traguin Travel</h2>

        <h3 style="color: #333;">Reset Your Password</h3>

        <p style="color: #555;">Hello Traveler,</p>

        <p style="color: #555;">
          We received a request to reset your password. Use the OTP below to continue.
        </p>

        <div style="margin: 20px 0;">
          <span style="
            display: inline-block;
            font-size: 32px;
            letter-spacing: 8px;
            font-weight: bold;
            color: #ffffff;
            background: #dc3545;
            padding: 12px 20px;
            border-radius: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #777;">
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="color: #999; font-size: 12px;">
          If you didn’t request a password reset, please ignore this email or contact support.
        </p>

        <hr style="margin: 25px 0;" />

        <p style="font-size: 12px; color: #aaa;">
          Need help? Contact support@traguin.com
        </p>

      </div>
    </div>
    `
  };

  await transporter.sendMail(mailOptions);
};