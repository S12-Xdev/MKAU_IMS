require("dotenv").config();
const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

let transporter = null;
if (emailUser && emailPass) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
} else {
  console.warn(
    "Email credentials are not fully configured. Emails will not be sent until EMAIL_USER and EMAIL_PASS are set."
  );
}

const sendEmail = async (to, subject, text) => {
  if (!transporter) {
    console.warn("Skipping email send because transporter is not configured.");
    return;
  }

  const mailOptions = {
    from: emailUser,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
