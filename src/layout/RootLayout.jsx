// hooks
import { useState } from "react";
import Cookies from "js-cookie";
// react router dom
import { Link, Outlet, useNavigate } from "react-router-dom";

import img from '../../public/images/user.png'

function RootLayout({ inputValue, filterData, handleInput }) {
  const [activeDropdown, setActiveDropdown] = useState("");
  const [active, setActive] = useState(false);

  const navigate = useNavigate();

  const closeSidebar = () => {
    setActive((prev) => !prev);
    if (!active) {
      setActiveDropdown("");
    }
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };

  function handleClickLogOut() {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    navigate(`/login`)
  } 

  return (
    <div className="root-layout">
      <header>
        <Link to="/" className={!active ? `logo` : `logo active`}>
          <i className="fa-solid fa-school"></i>
          <h1>Kindergarden</h1>
        </Link>
        <div className="navbar">
          <div onClick={closeSidebar} className="menu">
            <i className="fa-solid fa-bars"></i>
          </div>
          <div className="filters">
            <input type="text" value={inputValue} onChange={(e) => handleInput(e.target.value)} />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className="account">
            <img src={img} alt="user" />
            <span
              onClick={() => toggleDropdown("user-logout")}
              className="user-logout"
            >
              User{" "}
              <i
                className={`fa-solid ${activeDropdown === "user-logout"
                    ? "fa-chevron-down"
                    : "fa-chevron-left"
                  }`}
              ></i>
            </span>
            <div
              className="logout"
              onClick={handleClickLogOut}
              style={
                activeDropdown === "user-logout"
                  ? { display: "flex" }
                  : { display: "none" }
              }
            >
              {" "}
              <div className="log-span">
                <p>Logout</p>
              </div>{" "}
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
          </div>
        </div>
      </header>
      <main>
        {/* left sidebar */}
        <div className={!active ? `sidebar` : `sidebar active`}>
          <ul>
            <li className="children" onClick={() => toggleDropdown("children")}>
              <i className="sidebar-icon fa-solid fa-users"></i>
              <Link>
                <div>
                  Bolalar{" "}
                  <i
                    className={`fa-solid ${activeDropdown === "children"
                        ? "fa-chevron-down"
                        : "fa-chevron-left"
                      }`}
                  ></i>
                </div>
              </Link>
            </li>
            <div
              className={`children-dropdown ${activeDropdown === "children" ? "active" : ""
                }`}
            >
              <div className="first">
                <span></span>
                <Link to="/attendance">Davomat</Link>
              </div>
              <div className="second">
                <span></span>
                <Link to="/payment">To'lov</Link>
              </div>
            </div>
            <li
              className="employees"
              onClick={() => toggleDropdown("employees")}
            >
              <i className="sidebar-icon fa-solid fa-users"></i>
              <Link to="/">
                <div>
                  Hodimlar{" "}
                  <i
                    className={`fa-solid ${activeDropdown === "employees"
                        ? "fa-chevron-down"
                        : "fa-chevron-left"
                      }`}
                  ></i>
                </div>
              </Link>
            </li>
            <div
              className={`children-dropdown ${activeDropdown === "employees" ? "active" : ""
                }`}
            >
              <div className="first">
                <span></span>
                <Link to="/employees">Davomat</Link>
              </div>
              <div className="second">
                <span></span>
                <Link to="/salary">Maosh</Link>
              </div>
            </div>
            <li>
              <i className="sidebar-icon fa-solid fa-money-check-dollar"></i>
              <Link to="/expenses">Harajat</Link>
            </li>
            <li>
              <i className="sidebar-icon fa-solid fa-hand-holding-dollar"></i>
              <Link to="/income">Daromad</Link>
            </li>
            <li>
              <i className="sidebar-icon fa-solid fa-book"></i>
              <Link to="/reports">Hisobotlar</Link>
            </li>
            <li>
              <i className="sidebar-icon fa-solid fa-chart-line"></i>
              <Link to="/statistics">Statistikalar</Link>
            </li>
          </ul>
        </div>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}

export default RootLayout;
