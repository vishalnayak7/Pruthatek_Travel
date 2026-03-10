import ContactInfo from "./contactInfo.model.js";
import ContactMessage from "./contactMessage.model.js";
import nodemailer from "nodemailer";

class ContactService {

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async saveContactInfo(data) {
  return ContactInfo.findOneAndUpdate(
    {},
    data,
    { new: true, upsert: true }
  );
}

  async getContactInfo() {
    return ContactInfo.findOne();
  }

  // create message + send email
  async createMessage(data) {
    const { firstName, lastName, email, message } = data;
    const savedMessage = await ContactMessage.create(data);
  
  const mailOptions = {
  from: `"Traguin Travel" <${process.env.EMAIL_USER}>`,
  to: "surajmendhe32@gmail.com",
  subject: "New Customer Inquiry | Traguin Travel",

  html: `
  <h3>New Customer Inquiry</h3>

  <p><b>Name:</b> ${firstName} ${lastName}</p>
  <p><b>Email:</b> ${email}</p>

  <p><b>Message:</b></p>
  <p>${message}</p>

  `,
};

  try {
  await this.transporter.sendMail(mailOptions);
} catch (err) {
  console.error("Email sending failed:", err.message);
}

    return savedMessage;
  }

  async getAllMessages() {
    return ContactMessage.find().sort({ createdAt: -1 });
  }
}

export default new ContactService();