const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      password,
      age,
      occupation,
      incomeRange,
      preferredLanguage,
      location,
    } = req.body;
    console.log(req.body);

    // Check existing user
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      mobileNumber,
      password: hashedPassword,
      age,
      occupation,
      incomeRange,
      preferredLanguage,
      location,
    });
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;
    console.log(req.body);

    // Find user
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("getSingleUser called with userId:", userId);

    // 1️⃣ Validate
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 2️⃣ Find user by ID
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Success response
    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("getSingleUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
  getSingleUser
};