import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../../service/Api";
import InstitutionType from "../../components/InstitutionType";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import UserImage from "../../ui/UserImage";
import EditIcon from '@mui/icons-material/Edit';

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
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const [editMode, setEditMode] = useState({});


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

  const handleEdit = (id) => {
    setEditMode(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxChange = (id) => {
    setData(prevData => prevData.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, is_present: !item.is_present };
        if (updatedItem.is_present) {
          setUpdatedUsers(prev => [...prev, id]);
        } else {
          setUpdatedUsers(prev => prev.filter(userId => userId !== id));
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleSave = async () => {
    handleReload();
    try {
      const token = Cookies.get('access_token');
      await axios.post('/users/attendance/create/', { users: updatedUsers }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlert({ type: 'success', message: 'Davomat muvaffaqiyatli saqlandi' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Davomatni saqlashda xatolik yuz berdi: ' + error.message });
    }
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
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="user-image-wrapper">
                          <UserImage src={item.face_image} />
                        </div>
                      </td>
                      <td className="name-click" onClick={() => handleNameAbout(item)}>
                        {item.first_name} {item.last_name} {item.middle_name}
                      </td>
                      <td>{date}</td>
                      <td>
                        <input
                          style={{ pointerEvents: editMode[item.id] ? 'auto' : 'none', borderColor: editMode[item.id] ? 'blue' : '', boxShadow: editMode[item.id] ? '0 0 5px blue' : '' }}
                          type="checkbox"
                          checked={item.is_present}
                          readOnly={!editMode[item.id]}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                        {!item.is_present && (
                          <EditIcon onClick={() => handleEdit(item.id)} style={{ cursor: 'pointer', marginLeft: '10px', color: 'orange', fontSize: '20px' }} />
                        )}
                      </td>
                    </tr>
                  ))
                ) : <tr><td style={{ textAlign: 'center' }} colSpan={3}>M'alumot topilmadi</td></tr>}
              </tbody>
            </table>
            <div className="save-button-wrapper">
              <button onClick={handleSave} className="save-button">Saqlash</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Employees;
