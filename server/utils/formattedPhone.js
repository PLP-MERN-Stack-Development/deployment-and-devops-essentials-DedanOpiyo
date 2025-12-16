// utils/formattedPhone.js
const formatPhoneNumber = (phone) => {
  phone = phone.toString().trim();

  if (phone.startsWith("0")) {
    return "254" + phone.slice(1);
  }

  if (phone.startsWith("+254")) {
    return phone.slice(1);
  }

  if (phone.startsWith("254") && phone.length === 12) {
    return phone;
  }

  throw new Error("Invalid phone number format");
}

module.exports = { formatPhoneNumber };
