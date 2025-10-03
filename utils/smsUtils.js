const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const senderNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken && accountSid.startsWith("AC")) {
  client = twilio(accountSid, authToken);
} else {
  console.warn(
    "Twilio credentials are missing or invalid. SMS functionality is disabled until environment variables are configured."
  );
}

const sendSMS = async (to, message) => {
  if (!client) {
    console.warn("Skipping SMS send because Twilio client is not configured.");
    return;
  }
  try {
    await client.messages.create({
      body: message,
      from: senderNumber,
      to,
    });
    console.log("SMS sent successfully!");
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

module.exports = { sendSMS };
