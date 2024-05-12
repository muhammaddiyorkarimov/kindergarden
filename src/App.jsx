import React, { useState, useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Cookies from "js-cookie";
import './App.css'

// pages
import Attendance from "./pages/attendance/Attendance";
import Salary from "./pages/Salary";

// layouts
import RootLayout from "./layout/RootLayout";
import Home from "./pages/home/Home";
import UserAttendance from "./pages/attendance/UserAttendance";
import Login from "./pages/Login/Login";
import Payment from "./pages/payment/Payment";

const PrivateRoutes = () => {
  const auth = Cookies.get("access_token");
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    }, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  function handleClickLogOut() {
    handleLogout();
  }

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<RootLayout handleClickLogOut={handleClickLogOut} />}>
            <Route index element={<Home />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path='/attendance/:id' element={<UserAttendance />} />
            <Route path='/payment' element={<Payment />} />
            <Route path="/salary" element={<Salary />} />
          </Route>
        </Route>
      </>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
