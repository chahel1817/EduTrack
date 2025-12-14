import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"EduTrack" <no-reply@edutrack.com>',
    to,
    subject,
    text,
  });

  console.log("📩 OTP Email Preview URL:", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
