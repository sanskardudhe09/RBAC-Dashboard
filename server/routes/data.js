const express = require("express");
const router = express.Router();
const { authMiddleware, requireAdmin, requireEditor, requireViewer } = require("../middleware/auth");

// Mock data for dashboard
const mockData = {
  orders: [
    { id: 1, customerName: "John Doe", orderNumber: "ORD-001", status: "Pending", amount: 150.00, date: "2024-01-15" },
    { id: 2, customerName: "Jane Smith", orderNumber: "ORD-002", status: "Delivered", amount: 89.99, date: "2024-01-14" },
    { id: 3, customerName: "Bob Johnson", orderNumber: "ORD-003", status: "Processing", amount: 245.50, date: "2024-01-13" },
  ],
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "customer", status: "active", joinDate: "2024-01-01" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "customer", status: "active", joinDate: "2024-01-02" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "customer", status: "inactive", joinDate: "2024-01-03" },
  ],
  riders: [
    { id: 1, name: "Mike Wilson", email: "mike@delivery.com", status: "available", rating: 4.8, totalDeliveries: 150 },
    { id: 2, name: "Sarah Davis", email: "sarah@delivery.com", status: "busy", rating: 4.9, totalDeliveries: 200 },
    { id: 3, name: "Tom Anderson", email: "tom@delivery.com", status: "offline", rating: 4.7, totalDeliveries: 120 },
  ],
  settings: {
    siteName: "RBAC Admin Dashboard",
    theme: "dark",
    version: "1.0.0",
    maintenanceMode: false,
    maxLoginAttempts: 5,
    sessionTimeout: 600
  }
};

// Get data by type with role-based access
router.get("/data/:type", authMiddleware, (req, res) => {
  try {
    const { type } = req.params;
    const { role } = req.user;

    // Check permissions based on data type
    switch (type) {
      case "orders":
        if (!["admin", "editor", "viewer"].includes(role)) {
          return res.status(403).json({ message: "Access denied for orders data." });
        }
        break;
      case "users":
        if (!["admin", "editor", "viewer"].includes(role)) {
          return res.status(403).json({ message: "Access denied for users data." });
        }
        break;
      case "riders":
        if (!["admin", "editor", "viewer"].includes(role)) {
          return res.status(403).json({ message: "Access denied for riders data." });
        }
        break;
      case "settings":
        if (role !== "admin") {
          return res.status(403).json({ message: "Only admins can access settings." });
        }
        break;
      default:
        return res.status(404).json({ message: "Data type not found." });
    }

    const data = mockData[type];
    if (!data) {
      return res.status(404).json({ message: "Data not found." });
    }

    res.json(data);
  } catch (err) {
    console.error("Data fetch error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Update data (admin and editor only)
router.put("/data/:type/:id", authMiddleware, requireEditor, (req, res) => {
  try {
    const { type, id } = req.params;
    const { role } = req.user;

    // Only admin can edit settings
    if (type === "settings" && role !== "admin") {
      return res.status(403).json({ message: "Only admins can edit settings." });
    }

    // Mock update response
    res.json({ 
      message: `${type} with id ${id} updated successfully`,
      updatedData: req.body
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Delete data (admin only)
router.delete("/data/:type/:id", authMiddleware, requireAdmin, (req, res) => {
  try {
    const { type, id } = req.params;

    // Mock delete response
    res.json({ 
      message: `${type} with id ${id} deleted successfully`
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Get dashboard statistics
router.get("/dashboard/stats", authMiddleware, requireViewer, (req, res) => {
  try {
    const stats = {
      totalOrders: mockData.orders.length,
      totalUsers: mockData.users.length,
      totalRiders: mockData.riders.length,
      pendingOrders: mockData.orders.filter(order => order.status === "Pending").length,
      activeRiders: mockData.riders.filter(rider => rider.status === "available").length,
      totalRevenue: mockData.orders.reduce((sum, order) => sum + order.amount, 0)
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router; 