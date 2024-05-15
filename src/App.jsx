// hooks
import { useState, useEffect } from "react";
// react router dom
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
// js cookie
import Cookies from "js-cookie";
// css
import "./App.css";
// layouts
import RootLayout from "./layout/RootLayout";
// pages
import Attendance from "./pages/attendance/Attendance";
import Salary from "./pages/salary/Salary";
import Home from "./pages/home/Home";
import UserAttendance from "./pages/attendance/UserAttendance";
import Login from "./pages/Login/Login";
import Payment from "./pages/payment/Payment";
import Expenses from "./pages/Expenses/Expenses";
import ExpensesCreate from "./pages/Expenses/ExpensesCreate";
import PaymentUser from "./pages/payment/PaymentUser";
import Employees from "./pages/Employees/Employees";
import UserEmployees from "./pages/Employees/UserEmployees";
import UserSalary from "./pages/salary/UserSalary";
import Reports from "./report/Reports";

const PrivateRoutes = ({ inputValue, filterData }) => {
  const auth = Cookies.get("access_token");
  return auth ? <Outlet inputValue={inputValue} filterData={filterData} /> : <Navigate to="/login" />;
};

function App() {
  // useState
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
    }, 100 * 60 * 1000);
  
    return () => clearInterval(interval); 
  }, []);
  

function handleClickLogOut() {
  // handleLogout();
}

const handleInput = (value) => {
  setInputValue(value.toLowerCase());
  console.log(inputValue);
};

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login handleLogin={handleLogin} />} />
      <Route element={<PrivateRoutes inputValue={inputValue} filterData={filterData} />}>
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
          <Route path="/attendance" element={<Attendance />} />
          <Route path='/attendance/:id' element={<UserAttendance />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/payment/:id' element={<PaymentUser />} />
          <Route path="/employees" element={<Employees />} />
          <Route path='/employees/:id' element={<UserEmployees />} />
          <Route path="/salary" element={<Salary />} />
          <Route path='/salary/:id' element={<UserSalary />} />
          <Route path="/reports" element={<Reports />} />
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
