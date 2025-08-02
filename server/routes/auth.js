const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { authMiddleware, requireAdmin } = require("../middleware/auth");

// Mock users data
const mockUsers = [
  { 
    id: "1", 
    email: "admin@site.com", 
    password: "admin123", 
    role: "admin",
    lastLogin: new Date()
  },
  { 
    id: "2", 
    email: "editor@site.com", 
    password: "editor123", 
    role: "editor",
    lastLogin: new Date()
  },
  { 
    id: "3", 
    email: "viewer@site.com", 
    password: "viewer123", 
    role: "viewer",
    lastLogin: new Date()
  }
];

// Login route
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", { email: req.body.email });
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log("User found:", { email: user.email, role: user.role });

    // Check password (simple string comparison for mock data)
    if (user.password !== password) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log("Password validated successfully");

    // Update last login
    user.lastLogin = new Date();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        email: user.email 
      }, 
      process.env.JWT_SECRET || "your-secret-key", 
      { 
        expiresIn: "10m", // 10 minutes expiry
        issuer: "rbac-dashboard",
        audience: "dashboard-users"
      }
    );

    console.log("JWT token generated successfully");

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get current user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = mockUsers.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Logout route (client-side token removal)
router.post("/logout", authMiddleware, (req, res) => {
  res.json({ message: "Logged out successfully." });
});

// Get all users (admin only)
router.get("/users", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const usersWithoutPassword = mockUsers.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    }));
    res.json(usersWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router; 