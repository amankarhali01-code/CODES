const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
};

const ensureAdminExists = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD missing in environment variables.");
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await User.create({
    email: adminEmail.toLowerCase(),
    password: hashedPassword,
    role: "admin",
  });

  console.log("Default admin account created from environment variables.");
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = {
  loginAdmin,
  ensureAdminExists,
};
