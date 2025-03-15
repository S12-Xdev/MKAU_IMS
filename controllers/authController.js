const userService = require("../services/userService");
const authUtils = require("../utils/authUtils");
const { sendEmail } = require("../utils/emailUtils");
const { sendSMS } = require("../utils/smsUtils");


const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await authUtils.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = authUtils.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Store token in cookies
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: false,
        maxAge: 40 * 1000,
      });
      res.json({ message: "Login successfully", token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  logout: (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
  },

  forgotPassword: async (req, res) => {
    const { email, phone } = req.body;

    try {
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = authUtils.generateToken({ email }, "20m"); // Expires in 15 min
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      await sendEmail(
        email,
        "Password Reset",
        `Click this link to reset your password: ${resetLink}`
      );
      const otp = authUtils.generateNumericOTP(6);
      await sendSMS(
        phone,
        `You have requested to reset your password. Your OTP code is: ${otp}. Do not share this code with anyone.`
      );

      res.json({ message: "Password reset link sent to email and OTP code via SMS" });
    } catch (error) {
      res.status(500).json({ message: "Error sending reset email" });
    }
  },

  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const decoded = authUtils.verifyToken(token);
      if (!decoded) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const hashedPassword = await authUtils.hashPassword(newPassword);
      await userService.updateUserPassword(decoded.email, hashedPassword);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password" });
    }
  },
};

module.exports = authController;
