const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET || "default_secret";

const authUtils = {
  generateToken: (payload, expiresIn = "1h") => {
    return jwt.sign(payload, secretKey, { expiresIn });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      return null;
    }
  },

  hashPassword: async (password) => {
    return await bcrypt.hash(password, 10);
  },

  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  generateNumericOTP: (length) => {
    return otpGenerator.generate(length, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
  },
};

module.exports = authUtils;
