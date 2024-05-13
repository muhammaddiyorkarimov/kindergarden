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
import "./App.css";

// pages
import Attendance from "./pages/attendance/Attendance";
import Salary from "./pages/salary/Salary";

// layouts
import RootLayout from "./layout/RootLayout";
import Home from "./pages/home/Home";
import UserAttendance from "./pages/attendance/UserAttendance";
import Login from "./pages/Login/Login";
import Payment from "./pages/payment/Payment";
<<<<<<< HEAD
import Expenses from "./pages/Expenses/Expenses";
import ExpensesCreate from "./pages/Expenses/ExpensesCreate";
=======
import PaymentUser from "./pages/payment/PaymentUser";
import Employees from "./pages/Employees/Employees";
import UserEmployees from "./pages/Employees/UserEmployees";
import UserSalary from "./pages/salary/UserSalary";
>>>>>>> 4ac6209125b1f4a86bd0aa7f4be76b50ce6e1d33

const PrivateRoutes = ( {inputValue, filterData }) => {
  const auth = Cookies.get("access_token");
  return auth ? <Outlet inputValue={inputValue} filterData={filterData} /> : <Navigate to="/login" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filterData, setFilterData] = useState([]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
<<<<<<< HEAD
    }, 10 * 60 * 1000);
=======
    }, 100 * 60 * 1000);
>>>>>>> 4ac6209125b1f4a86bd0aa7f4be76b50ce6e1d33

    return () => clearInterval(interval);
  }, []);

  function handleClickLogOut() {
    // handleLogout();+
  }

  const handleInput = (value) => {
    setInputValue(value.toLowerCase());
    console.log(inputValue);
  };

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route element={<PrivateRoutes inputValue={inputValue} filterData={filterData}  />}>
          <Route
            path="/"
            element={
              <RootLayout
                filterData={filterData}
                inputValue={inputValue}
                handleInput={handleInput}
                handleClickLogOut={handleClickLogOut}
              />
            }
          >
            <Route index element={<Home />} />
<<<<<<< HEAD
            <Route
              path="/attendance"
              element={
                <Attendance
                  setFilterData={setFilterData}
                  inputValue={inputValue}
                />
              }
            />
            <Route path="/attendance/:id" element={<UserAttendance />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expenses/expensescreate" element={<ExpensesCreate />} />
=======
            <Route path="/attendance" element={<Attendance />} />
            <Route path='/attendance/:id' element={<UserAttendance />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/payment/:id' element={<PaymentUser/>} />
            <Route path="/employees" element={<Employees />} />
            <Route path='/employees/:id' element={<UserEmployees/>} />
            <Route path="/salary" element={<Salary />} />
            <Route path='/salary/:id' element={<UserSalary/>} />
>>>>>>> 4ac6209125b1f4a86bd0aa7f4be76b50ce6e1d33
          </Route>
        </Route>
      </>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={routes} />
      <Outlet inputValue={inputValue} filterData={filterData} />
    </div>
  );
}

export default App;
