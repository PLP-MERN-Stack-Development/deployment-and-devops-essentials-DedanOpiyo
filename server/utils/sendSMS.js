// utils/sendSMS.js
const sendSMS = async (phone, message) => {
  console.log("SMS hook ready:", phone, message);
  // Future integration: Twilio / Africa's Talking
};

module.exports = { sendSMS };
