const jwt = require("jsonwebtoken");

// Mock users data (same as in auth.js)
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

// JWT verification middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Check if user still exists in mock data
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = {
      _id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(403).json({ message: "Invalid token." });
  }
};

// RBAC middleware for role-based access control
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

// Specific role middlewares
const requireAdmin = requireRole(['admin']);
const requireEditor = requireRole(['admin', 'editor']);
const requireViewer = requireRole(['admin', 'editor', 'viewer']);

module.exports = {
  authMiddleware,
  requireRole,
  requireAdmin,
  requireEditor,
  requireViewer
}; 