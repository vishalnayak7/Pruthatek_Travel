import bcrypt from "bcryptjs";
import { USER_MODEL } from "./user.model.js"; 
import crypto from "crypto";
import nodemailer from "nodemailer";

class UserService {

  async create(data) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return USER_MODEL.create(data);
}

  async getAll() {
    return USER_MODEL.find().select("-password");
  }

  async getById(id) {
    return USER_MODEL.findById(id).select("-password");
  }

  async getByEmail(email) {
    return USER_MODEL.findOne({ email }).select("+password");
  }

  async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return USER_MODEL.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).select("-password");
  }

  async delete(id) {
    return USER_MODEL.findByIdAndDelete(id);
  }

  async forgotPassword(email) {
    const user = await USER_MODEL.findOne({ email });
    if (!user) throw new Error("User with this email does not exist");

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"PRUTHATEK Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Use the token below to reset your password:</p>
        <h4>${resetToken}</h4>
        <p>This token will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { message: "Password reset email sent successfully" };
  }

  async resetPassword(token, newPassword) {
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await USER_MODEL.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Invalid or expired reset token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password reset successful" };
  }
}

export default new UserService();
