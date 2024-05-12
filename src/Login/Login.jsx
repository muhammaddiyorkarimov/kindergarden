import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import setCookie from "../function";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokens = async () => {
      const accessToken = Cookies.get("access_token");
      const refreshToken = Cookies.get("refresh_token");
      if (accessToken && refreshToken) {
        try {
          await axios.post(
            "https://kindergarten-ms.techcraft.uz/api/v1/users/token/refresh/",
            { refresh: refreshToken }
          );

          navigateToHome();
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      }
    };
    checkTokens();
  }, [navigate]);

  const navigateToHome = () => {
    navigate("/");
  };

  const handleLoginFormSubmit = async () => {
    try {
      const response = await axios.post(
        "https://kindergarten-ms.techcraft.uz/api/v1/users/token/",
        {
          username: username,
          password: password,
        }
      );
      const { access, refresh } = response.data;
      Cookies.set("access_token", access);
      Cookies.set("refresh_token", refresh);

      navigateToHome();
    } catch (error) {
      setError(error.response.data.detail);
    }
  };

  function validation() {
    if (!username || !password) {
      alert("Please enter both username and password.");
      
      return false;
    }
    if (password.length < 8) {
      alert("Password should be at least 8 characters long.");
      return false;
    }
    return true;
  }

  const handleLogin = () => {
    if (validation()) {
      handleLoginFormSubmit();
    }
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="container">
      <div className="login-wrapper">
        <i className="fa-solid fa-school"></i>
        <h3>Maktab va Bog'cha</h3>
        <h4>School and Kindergarden</h4>
        <div className="input-logs">
          <label htmlFor="username">Username</label>
          <div className="input-wrap">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
            />
            <i className="fa-solid fa-envelope"></i>
          </div>
        </div>
        <div className="input-logs">
          <label htmlFor="password">Password</label>
          <div className="input-wrap">
            <input
              value={password}
              ref={passwordInputRef}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
            />
            <i className="fa-solid fa-lock"></i>
          </div>
        </div>
        <div className="checkbox-btn">
          <div className="checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleCheckboxChange}
            />
            <span>Eslab qolish</span>
          </div>
          <button onClick={handleLogin}>Kirish</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
