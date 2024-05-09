// hooks
import { useState } from 'react'
// react router dom
import { Link, Outlet } from 'react-router-dom'

function RootLayout() {
  const [activeDropdown, setActiveDropdown] = useState('');
  const [active, setActive] = useState(false)

  const closeSidebar = () => {
    setActive((prev => {
      return !active ? true : false
    }))
  }

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
  };

  return (
    <div className='root-layout'>
      <header>
        <Link to='/' className={!active ? `logo` : `logo active`}>
          <i className="fa-solid fa-school"></i>
          <h1>Kindergarden</h1>
        </Link>
        <div className="navbar">
          <div onClick={closeSidebar} className="menu">
            <i className="fa-solid fa-bars"></i>
          </div>
          <div className="filters">
            <input type="text" />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className="account">
            <img src="./public/images/user.png" alt="user" />
            <span>User <i className="fa-solid fa-chevron-down"></i></span>
          </div>
        </div>
      </header>
      <main>
        {/* left sidebar */}
        <div className={!active ? `sidebar` : `sidebar active`}>
          <ul>
            <li className='children' onClick={() => toggleDropdown('children')}>
              <i className="sidebar-icon fa-solid fa-users"></i>
              <Link>
                <div>
                  Bolalar <i className={`fa-solid ${activeDropdown === 'children' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i>
                </div>
              </Link>
            </li>
            <div className={`children-dropdown ${activeDropdown === 'children' ? 'active' : ''}`}>
              <div className="first">
                <span></span>
                <Link to='/attendance'>Davomat</Link>
              </div>
              <div className="second">
                <span></span>
                <Link to='/salary'>To'lov</Link>
              </div>
            </div>
            <li className='employees' onClick={() => toggleDropdown('employees')}>
              <i className="sidebar-icon fa-solid fa-users"></i>
              <Link to='/'>
                <div>
                  Hodimlar <i className={`fa-solid ${activeDropdown === 'employees' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i>
                </div>
              </Link>
            </li>
            <div className={`children-dropdown ${activeDropdown === 'employees' ? 'active' : ''}`}>
              <div className="first">
                <span></span>
                <Link to='/attendance'>Davomat</Link>
              </div>
              <div className="second">
                <span></span>
                <Link to='/income'>Maosh</Link>
              </div>
            </div>
            <li>
              <i className="sidebar-icon fa-solid fa-money-check-dollar"></i>
              <Link to='/costs'>Harajat</Link>
            </li>
            <li>
              <i className="sidebar-icon fa-solid fa-hand-holding-dollar"></i>
              <Link to='/income'>Daromad</Link>
            </li>
            <li>
              <i className="sidebar-icon fa-solid fa-book"></i>
              <Link to='/reports'>Hisobotlar</Link>
            </li>
            <li>
              <i className="sidebar-icon fa-solid fa-chart-line"></i>
              <Link to='/statistics'>Statistikalar</Link>
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
