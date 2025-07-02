import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // You'll need to run: npm install jwt-decode
import "./login.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("id_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    const VITE_COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
    const VITE_COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const VITE_LOGOUT_URI = import.meta.env.VITE_LOGOUT_URI;

    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");

    // Redirect to Cognito's logout endpoint to clear the central session
    window.location.href = `https://${VITE_COGNITO_DOMAIN}/logout?client_id=${VITE_COGNITO_CLIENT_ID}&logout_uri=${VITE_LOGOUT_URI}`;
  };

  // ... rest of the component is the same ...
  if (!user)
    return (
      <div className="auth-container">
        <p>Loading...</p>
      </div>
    );
  return (
    <div className="auth-container">
      <h1 className="dashboard-greeting">Dashboard</h1>
      <div className="dashboard-info">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>User ID:</strong> {user.sub}
        </p>
      </div>
      <button onClick={handleLogout} className="auth-button logout-button">
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
