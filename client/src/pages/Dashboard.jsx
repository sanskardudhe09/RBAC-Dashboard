import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/Card";
import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState({
    orders: [],
    users: [],
    riders: [],
    settings: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();
  const { user, logout, tokenExpiryWarning, setTokenExpiryWarning } = useAuth();

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const types = ["orders", "users", "riders", "settings"];
      const result = {};

      for (const type of types) {
        try {
          const response = await axios.get(`/api/data/${type}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          result[type] = response.data;
        } catch (err) {
          if (err.response?.status === 403) {
            // Skip settings if not admin
            if (type === "settings") continue;
          }
          result[type] = [];
        }
      }

      setData(result);
    } catch (err) {
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleEdit = (item, type) => {
    console.log(`Edit ${type}:`, item);
    // In a real application, this would open an edit modal or navigate to edit page
    alert(`Edit functionality for ${type} would be implemented here`);
  };

  const handleDelete = async (item, type) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/data/${type}/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh data after deletion
      fetchData();
      fetchStats();
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSettingsClick = () => {
    if (user.role === "admin") {
      navigate("/settings");
    } else {
      navigate("/not-authorized");
    }
  };

  const toggleCard = (cardId) => {
    console.log(`Toggling card: ${cardId}. Current expanded: ${expandedCard}`);
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.email}</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="role-badge">{user?.role}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Token Expiry Warning */}
      {tokenExpiryWarning && (
        <div className="token-warning">
          <span>⚠️ Your session will expire soon. Please save your work.</span>
          <button onClick={() => setTokenExpiryWarning(false)}>×</button>
        </div>
      )}


      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Active Riders</h3>
            <p className="stat-number">{stats.activeRiders || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}
        
        <div className="cards-grid">
          <Card
            cardId="orders"
            title="Orders"
            items={data.orders}
            role={user?.role}
            onEdit={(item) => handleEdit(item, "orders")}
            onDelete={(item) => handleDelete(item, "orders")}
            isExpanded={expandedCard === "orders"}
            onToggle={() => toggleCard("orders")}
          />
          
          <Card
            cardId="users"
            title="Users"
            items={data.users}
            role={user?.role}
            onEdit={(item) => handleEdit(item, "users")}
            onDelete={(item) => handleDelete(item, "users")}
            isExpanded={expandedCard === "users"}
            onToggle={() => toggleCard("users")}
          />
          
          <Card
            cardId="riders"
            title="Riders"
            items={data.riders}
            role={user?.role}
            onEdit={(item) => handleEdit(item, "riders")}
            onDelete={(item) => handleDelete(item, "riders")}
            isExpanded={expandedCard === "riders"}
            onToggle={() => toggleCard("riders")}
          />
          
          {user?.role === "admin" && (
            <Card
              cardId="settings"
              title="Settings"
              items={data.settings}
              role={user?.role}
              onEdit={(item) => handleEdit(item, "settings")}
              onDelete={(item) => handleDelete(item, "settings")}
              isExpanded={expandedCard === "settings"}
              onToggle={() => toggleCard("settings")}
            />
          )}
        </div>

        {/* Settings Button for Admin */}
        {user?.role === "admin" && (
          <div className="settings-section">
            <button className="settings-btn" onClick={handleSettingsClick}>
              ⚙️ Manage Settings
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 