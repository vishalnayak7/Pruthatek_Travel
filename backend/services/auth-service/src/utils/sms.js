import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSmsOtp = async (phone, otp) => {
  await client.messages.create({
    body: `Your Traguin Travel OTP is ${otp}. It expires in 10 minutes. Never share this code with anyone.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${phone}`
  });
};
