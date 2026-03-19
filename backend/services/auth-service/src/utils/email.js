import nodemailer from "nodemailer";

export const sendEmailOtp = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // const mailOptions = {
  //   from: process.env.EMAIL_USER,
  //   to: toEmail,
  //   subject: "Your OTP Code",
  //   html: `
  //     <h2>Your OTP is: ${otp}</h2>
  //     <p>This OTP will expire in 10 minutes.</p>
  //   `
  // };
  const mailOptions = {
  from: `"Traguin Travel" <${process.env.EMAIL_USER}>`,
  to: toEmail,
  subject: "Verify your account - Traguin Travel",
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">

      <h2 style="color: #2c3e50;">🌍 Traguin Travel</h2>
      <p style="color: #555;">Hello Traveler,</p>

      <h3 style="color: #333;">Verify Your Account</h3>
      <p style="color: #555;">
        Use the OTP below to complete your signup process.
      </p>

      <div style="margin: 20px 0;">
        <span style="
          display: inline-block;
          font-size: 28px;
          letter-spacing: 6px;
          font-weight: bold;
          color: #ffffff;
          background: #007bff;
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
        If you didn’t request this, you can safely ignore this email.
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
