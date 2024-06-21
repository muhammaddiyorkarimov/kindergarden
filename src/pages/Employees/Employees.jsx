import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../../service/Api";
import InstitutionType from "../../components/InstitutionType";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import UserImage from "../../ui/UserImage";
import SearchInputs from "../../components/SerachInputs";

function Employees() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const urlInsId = query.get('organization') || '';
  const urlDate = query.get('date') || getCurrentDate();

  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(urlInsId);
  const [insId, setInsId] = useState(urlInsId || '');
  const [insNameId, setInsNameId] = useState('');
  const [date, setDate] = useState(urlDate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchAttendanceData = async (url) => {
      const token = Cookies.get('access_token');
      try {
        setLoading(true);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setData(response.data.results);
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        setLoading(false);
      }
    }
    if (insId) {
      const url = `/users/attendance/list/?organization=${insId}&type=worker&date=${date}`;
      fetchAttendanceData(url);
    } else {
      const url = `/users/attendance/list/?type=worker&date=${date}`;
      fetchAttendanceData(url);
    }
  }, [insId, date]);

  useEffect(() => {
    if (urlInsId) {
      setInsId(urlInsId);
    }
  }, [urlInsId]);
  
  useEffect(() => {
    if (!query.get('date')) {
      navigate(`/employees?${insId ? `organization=${insId}&` : ''}&type=worker&date=${date}`);
    }
  }, []);

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
    navigate(`/employees?organization=${id}&type=worker&date=${date}`);
  };

  const handleGetInsName = (name) => {
    setInsNameId(name);
  };

  const handleNameAbout = (item) => {
    navigate(`${item.id}`);
  };

  const handleGetDate = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    navigate(`/employees?organization=${insId}&type=worker&date=${newDate}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const normalizeString = (str) => {
    return str.toLowerCase().replace(/x/g, 'h');
  };

  const filteredData = data.filter(item =>
    normalizeString(`${item.first_name} ${item.last_name} ${item.middle_name}`).includes(normalizeString(searchTerm))
  );

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
          <SearchInputs handleSearch={handleSearch} />
            <div className="items">
              <div className="a-count">
                <p>Davomat: {employees && `${employees.count} dan ${employees.total_presences}`}</p>
              </div>
              <InstitutionType
                handleGetInsId={handleGetInsId}
                handleGetInsName={handleGetInsName}
                activeDropdown={activeDropdown}
                insNameId={insNameId}
                toggleDropdown={toggleDropdown}
                type="worker"
                date={date}
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
                  <th>Rasm</th>
                  <th>ISM</th>
                  <th>Sana</th>
                  <th>Davomat</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>
                      <span>Rasm:</span>
                        <div className="user-image-wrapper">
                          <UserImage src={item.face_image}/>
                        </div>
                      </td>
                      <td className="name-click" onClick={() => handleNameAbout(item)}>
                      <span>Ism:</span>
                        {item.first_name} {item.last_name} {item.middle_name}
                      </td>
                      <td><span>Sana:</span>{date}</td>
                      <td>
                      <span>Davomat:</span>
                        <input
                          style={{ pointerEvents: 'none' }}
                          type="checkbox"
                          checked={item.is_present}
                          readOnly
                        />
                      </td>
                    </tr>
                  ))
                ) : <tr><td style={{ textAlign: 'center' }} colSpan={4}>M'alumot topilmadi</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Employees;
