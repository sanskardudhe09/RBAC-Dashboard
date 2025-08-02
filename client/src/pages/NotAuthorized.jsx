import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./NotAuthorized.css";

const NotAuthorized = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="not-authorized-container">
      <div className="not-authorized-card">
        <div className="error-icon">🚫</div>
        
        <h1>Access Denied</h1>
        <p className="error-message">
          You don't have permission to access this resource.
        </p>
        
        <div className="user-info">
          <p><strong>Current User:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
        
        <div className="permission-info">
          <h3>Required Permissions:</h3>
          <ul>
            <li>Admin role required for this page</li>
            <li>Your current role: {user?.role}</li>
            <li>Contact your administrator for access</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <button className="back-btn" onClick={handleGoBack}>
            ← Back to Dashboard
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        
        <div className="help-text">
          <p>
            If you believe this is an error, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized; 