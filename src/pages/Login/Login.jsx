import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Alert, AlertTitle } from "@mui/material";
import img from '../../../public/images/school.png';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

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
          setShowAlert(true);
          setAlertType("success");
          setAlertMessage("Token refreshed successfully!");
          setTimeout(() => {
            setShowAlert(false);
          }, 2000);
          navigateToHome();
        } catch (error) {
          console.error("Token refresh failed:", error);
          handleAlert("error", "Token refresh failed!");
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
      handleAlert("success", "Login successful!");
      navigateToHome();
    } catch (error) {
      handleError(error);
      timeoutRef.current = setTimeout(() => {
        if (!alert) {
          window.location.reload();
        }
      }, 10000);
    }
  };

  const validation = () => {
    if (!username || !password) {
      return false;
    }
    if (password.length <= 8) {
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validation()) {
      handleAlert("error", "Invalid username or password!");
      return;
    }

    await handleLoginFormSubmit();
  };

  const handleError = (error) => {
    console.log(error);
    handleAlert("error", error.message);
  };

  const handleAlert = (type, message) => {
    setShowAlert(true);
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="container">
      <div className="alert">
        {showAlert && (
          <Alert
            sx={{
              position: "display",
              width: "500px",
            }}
            variant="filled"
            severity={alertType}
          >
            <AlertTitle>
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            {alertMessage == "Request failed with status code 401" ? 'Login yoki parol xato':alertMessage}
          </Alert>
        )}
      </div>
      <div className="login-wrapper">
        <img src={img} alt="" />
        <h3>Maktab va Bog'cha</h3>
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
