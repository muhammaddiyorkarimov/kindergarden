import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../../service/Api";
import InstitutionType from "../../components/InstitutionType";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

function Attendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const urlInsId = query.get('organization') || '';

  const [data, setData] = useState(JSON.parse(localStorage.getItem('employeesData')) || []);
  const [employees, setEmployees] = useState(JSON.parse(localStorage.getItem('employees')) || null);
  const [activeDropdown, setActiveDropdown] = useState(urlInsId);
  const [insId, setInsId] = useState(localStorage.getItem('employeesInsId') || 1);
  const [insNameId, setInsNameId] = useState(localStorage.getItem('insNameId') || '');
  const [date, setDate] = useState(localStorage.getItem('employeesDate') || getCurrentDate());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  useEffect(() => {
    localStorage.setItem('employeesData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('employeesInsId', insId);
  }, [insId]);

  useEffect(() => {
    localStorage.setItem('insNameId', insNameId);
  }, [insNameId]);

  useEffect(() => {
    localStorage.setItem('employeesDate', date);
  }, [date]);


  useEffect(() => {
    async function fetchData() {
      const token = Cookies.get('access_token');
      try {
        setLoading(true);
        const response = await axios.get(`/users/attendance/list/?organization=${insId}&type=worker&date=${date}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setData(response.data.results);
        setEmployees(response.data); // Update attendance state
        setLoading(false);
        localStorage.setItem('employeesData', JSON.stringify(response.data.results));
        localStorage.setItem('employees', JSON.stringify(response.data));
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        setLoading(false);
      }
    }

    if (insId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [insId, date]);

  useEffect(() => {
    if (urlInsId) {
      setInsId(urlInsId);
    }
  }, [urlInsId]);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };

  const handleGetInsId = (id) => {
    setInsId(id);
    navigate(`/employees?organization=${id}`);
  };

  const handleGetInsName = (name) => {
    setInsNameId(name);
  };

  const handleNameAbout = (item) => {
    navigate(`${item.id}`);
  };

  const handleGetDate = (e) => {
    setDate(e.target.value);
  };

  return (
    <div className="attendance">
      {loading ? (
        <div className="loading">
          <ThreeDots color="#222D32" />
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="header">
            <div className="items">
              <div className="a-count">
                <p>Davomat: {insNameId && employees && `${employees.count} dan ${employees.total_presences}`}</p>
              </div>
              <InstitutionType
                handleGetInsId={handleGetInsId}
                handleGetInsName={handleGetInsName}
                activeDropdown={activeDropdown}
                insNameId={insNameId}
                toggleDropdown={toggleDropdown}
              />
              <div className="select-date">
                <input type="date" onChange={handleGetDate} value={date} />
              </div>
            </div>
          </div>
          <div className="body">
            <table>
              <thead>
                <tr>
                  <th>ISM</th>
                  <th>Sana</th>
                  <th>Davomat</th>
                </tr>
              </thead>
              <tbody>
                {insNameId ? (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td className="name-click" onClick={() => handleNameAbout(item)}>
                        {item.first_name} {item.last_name} {item.middle_name}
                      </td>
                      <td>{date}</td>
                      <td>
                        <input
                          style={{ pointerEvents: 'none' }}
                          type="checkbox"
                          checked={item.is_present} // Changed to checked
                          readOnly
                        />
                      </td>
                    </tr>
                  ))
                ) : <tr><td style={{ textAlign: 'center' }} colSpan={3}>M'alumot topilmadi</td></tr>}
              </tbody>
            </table>
            {data.length === 0 && (
              <div className="loading">
                <p>Ma'lumot topilmadi</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Attendance;
