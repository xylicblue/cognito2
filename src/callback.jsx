import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    // 1. Get the state parameter from the URL
    const encodedState = urlParams.get("state");

    const exchangeCodeForToken = async (authCode) => {
      try {
        // ... (The axios call to /oauth2/token remains exactly the same)
        // ...
        const VITE_COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
        const VITE_COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
        const VITE_COGNITO_REDIRECT_URI = import.meta.env
          .VITE_COGNITO_REDIRECT_URI;

        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("client_id", VITE_COGNITO_CLIENT_ID);
        params.append("code", authCode);
        params.append("redirect_uri", VITE_COGNITO_REDIRECT_URI);

        const response = await axios.post(
          `https://${VITE_COGNITO_DOMAIN}/oauth2/token`,
          params,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        localStorage.setItem("id_token", response.data.id_token);
        localStorage.setItem("access_token", response.data.access_token);

        // 2. Decode the state and decide where to go
        if (encodedState) {
          const decodedState = JSON.parse(atob(encodedState));
          // Reconstruct the original URL with query params and navigate there
          const finalUrl = `${decodedState.returnTo}?courseId=${
            decodedState.courseId
          }&courseName=${encodeURIComponent(decodedState.courseName)}`;
          navigate(finalUrl, { replace: true });
        } else {
          // Fallback for normal logins
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        navigate("/");
      }
    };

    if (code) {
      exchangeCodeForToken(code);
    }
  }, [location, navigate]);

  return (
    <div className="auth-container">
      <p>Finalizing login...</p>
    </div>
  );
};

export default Callback;
