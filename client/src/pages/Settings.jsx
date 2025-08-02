import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import "./Settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/data/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/not-authorized");
        return;
      }
      setMessage("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/data/settings/1", settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Settings saved successfully!");
    } catch (err) {
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <header className="settings-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              ← Back to Dashboard
            </button>
            <div className="header-left-content">
              <h1>Admin Setting Panel</h1>
            </div>
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

      <main className="settings-main">
        <div className="settings-card">
          <div className="settings-header">
            <h2>General Settings</h2>
            <p>Configure system-wide settings and preferences</p>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                value={settings.siteName || ""}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                placeholder="Enter site name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={settings.theme || "light"}
                onChange={(e) => handleInputChange("theme", e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="version">Version</label>
              <input
                type="text"
                id="version"
                value={settings.version || ""}
                onChange={(e) => handleInputChange("version", e.target.value)}
                placeholder="Enter version number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxLoginAttempts">Max Login Attempts</label>
              <input
                type="number"
                id="maxLoginAttempts"
                value={settings.maxLoginAttempts || 5}
                onChange={(e) => handleInputChange("maxLoginAttempts", parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sessionTimeout">Session Timeout (seconds)</label>
              <input
                type="number"
                id="sessionTimeout"
                value={settings.sessionTimeout || 600}
                onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value))}
                min="300"
                max="3600"
              />
            </div>

            {message && (
              <div className={`message ${message.includes("success") ? "success" : "error"}`}>
                {message}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="loading-spinner"></span>
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </button>
              <button
                type="button"
                className="reset-btn"
                onClick={fetchSettings}
                disabled={saving}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Settings Information</h3>
          <ul>
            <li><strong>Site Name:</strong> The name displayed in the browser title and header</li>
            <li><strong>Theme:</strong> Choose between light, dark, or automatic theme</li>
            <li><strong>Version:</strong> Current application version number</li>
            <li><strong>Maintenance Mode:</strong> Enable to restrict access during maintenance</li>
            <li><strong>Max Login Attempts:</strong> Maximum failed login attempts before lockout</li>
            <li><strong>Session Timeout:</strong> JWT token expiration time in seconds</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Settings; 