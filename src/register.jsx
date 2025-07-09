import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Checking authentication...");
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("id_token");
    const courseId = searchParams.get("courseId");
    const name = searchParams.get("courseName");

    setCourseName(name);

    if (token) {
      setStatus("Successfully registered!");
    } else {
      setStatus("Redirecting to sign in...");

      const appState = {
        returnTo: "/register",
        courseId: courseId,
        courseName: name,
      };

      const encodedState = btoa(JSON.stringify(appState));

      const VITE_COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
      const VITE_COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
      const VITE_COGNITO_REDIRECT_URI = import.meta.env
        .VITE_COGNITO_REDIRECT_URI;

      const loginUrl = `https://${VITE_COGNITO_DOMAIN}/authorize?response_type=code&client_id=${VITE_COGNITO_CLIENT_ID}&redirect_uri=${VITE_COGNITO_REDIRECT_URI}&scope=email+openid+profile&state=${encodedState}`;

      window.location.href = loginUrl;
    }
  }, [searchParams]);

  if (status === "Successfully registered!") {
    const token = localStorage.getItem("id_token");

    const userEmail = token ? jwtDecode(token).email : "your email";

    return (
      <div className="auth-container">
        <h1 className="dashboard-greeting">Registration Complete!</h1>
        <div className="dashboard-info">
          <p>The user:</p>
          <p style={{ fontWeight: "bold" }}>{userEmail}</p>
          <p style={{ marginTop: "1rem" }}>is now registered for the course:</p>
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{courseName}</p>
        </div>
      </div>
    );
  }

  // Show a loading message while redirecting
  return (
    <div className="auth-container">
      <h1 className="auth-title">Registering for Course...</h1>
      <p style={{ textAlign: "center" }}>{status}</p>
    </div>
  );
};

export default RegisterPage;
