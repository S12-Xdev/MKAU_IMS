const userService = require("../services/userService");
const {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
} = require("../utils/authUtils");
const { sendEmail } = require("../utils/emailUtils");

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({ id: user.id, email: user.email });

      // Store token in cookies
      res.cookie("authToken", token, { httpOnly: true, secure: false });
      res.json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  logout: (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = generateToken({ email }, "15m"); // Expires in 15 min
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      await sendEmail(
        email,
        "Password Reset",
        `Click this link to reset your password: ${resetLink}`
      );

      res.json({ message: "Password reset link sent to email" });
    } catch (error) {
      res.status(500).json({ message: "Error sending reset email" });
    }
  },

  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const hashedPassword = await hashPassword(newPassword);
      await userService.updateUserPassword(decoded.email, hashedPassword);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password" });
    }
  },
};

module.exports = authController;
