import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../../service/Api";
import "./Attendance.css";
import InstitutionType from "../../components/InstitutionType";
import GroupNumber from "../../components/GroupNumber";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import UserImage from "../../ui/UserImage";
import EditIcon from '@mui/icons-material/Edit';
import { Alert, AlertTitle } from "@mui/material";
import SearchInputs from './../../components/SerachInputs';

function Attendance() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const urlInsId = query.get('organization') || '';
  const urlGroupId = query.get('educating_group') || '';
  const urlDate = query.get('date') || getCurrentDate();

  const [insId, setInsId] = useState(urlInsId);
  const [groupId, setGroupId] = useState(urlGroupId);
  const [insNameId, setInsNameId] = useState('');
  const [groupNameId, setGroupNameId] = useState('');
  const [data, setData] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [date, setDate] = useState(urlDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeoutExpired, setTimeoutExpired] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAttendanceData = async (url) => {
      try {
        setLoading(true);
        setError(null);
        setTimeoutExpired(false);

        const token = Cookies.get('access_token');

        const timeout = setTimeout(() => {
          setTimeoutExpired(true);
          setLoading(false);
        }, 4000);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        clearTimeout(timeout);
        setData(response.data.results);
        setAttendance(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      }
    };

    if (groupId || insId) {
      const url = groupId
        ? `/users/attendance/list/?${insId ? `organization=${insId}&` : ''}educating_group=${groupId}&type=student&date=${date}`
        : `/users/attendance/list/?organization=${insId}&type=student&date=${date}`;
      fetchAttendanceData(url);
    } else {
      const url = `/users/attendance/list/?type=student&date=${date}`;
      fetchAttendanceData(url);
    }
  }, [insId, groupId, date]);

  useEffect(() => {
    if (urlInsId !== insId) {
      setInsId(urlInsId);
      setInsNameId('');
    }
    if (urlGroupId !== groupId) {
      setGroupId(urlGroupId);
      setGroupNameId('');
    }
    if (urlDate !== date) {
      setDate(urlDate);
    }
  }, [urlInsId, urlGroupId, urlDate]);

  useEffect(() => {
    if (!query.get('date')) {
      navigate(`/attendance?${insId ? `organization=${insId}&` : ''}${groupId ? `educating_group=${groupId}&` : ''}&type=student&date=${date}`);
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
    setGroupId('');
    navigate(`/attendance?organization=${id}&type=student&date=${date}`);
  };

  const handleGetInsName = (name) => {
    setInsNameId(name);
  };

  const handleGetGroupId = (id) => {
    setGroupId(id);
    navigate(`/attendance?${insId ? `organization=${insId}&` : ''}educating_group=${id}&type=student&date=${date}`);
  };

  const handleGetGroupName = (name) => {
    setGroupNameId(name);
  };

  const handleNameAbout = (item) => {
    navigate(`${item.id}`);
  };

  const handleGetDate = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    navigate(`/attendance?${insId ? `organization=${insId}&` : ''}${groupId ? `educating_group=${groupId}&` : ''}date=${newDate}`);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleEdit = (id) => {
    setEditMode(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxChange = (id) => {
    setData(prevData => prevData.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, is_present: !item.is_present };
        if (updatedItem.is_present) {
          setUpdatedUsers(prev => [...new Set([...prev, id])]);
        } else {
          setUpdatedUsers(prev => prev.filter(userId => userId !== id));
        }
        console.log(`Item ID: ${id}, is_present: ${updatedItem.is_present}`);
        return updatedItem;
      }
      return item;
    }));
  };

  const handleSave = async () => {
    console.log("Updated Users IDs: ", updatedUsers);
    try {
      const token = Cookies.get('access_token');
      await axios.post('/users/attendance/create/', { users: updatedUsers }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlert({ type: 'success', message: 'Davomat muvaffaqiyatli saqlandi' });
      setTimeout(() => window.location.reload(), 2000);
      setTimeout(() => setAlert(false), 2000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Davomatni saqlashda xatolik yuz berdi: ' + error.message });
    }
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
          {timeoutExpired ? (
            <div>
              <button className="reload-btn" onClick={handleReload}>Reload</button>
            </div>
          ) : (
            <div className="loading">
              <ThreeDots color="#222D32" />
            </div>
          )}
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {alert && (
            <Alert severity={alert.type} style={{ backgroundColor: "green", color: "white", position: 'fixed', top: '100px', zIndex: 9999, maxWidth: '300px' }}>
              <AlertTitle>{alert.type === 'success' ? 'Muvaffaqiyat' : 'Xatolik'}</AlertTitle>
              {alert.message}
            </Alert>
          )}
          <div className="header">
            <SearchInputs handleSearch={handleSearch} />
            <div className="items">
              <div className="a-count">
                <p>
                  Davomat:{" "}
                  {attendance
                    ? `${attendance.count} dan ${attendance.total_presences}`
                    : ""}
                </p>
              </div>
              <InstitutionType
                handleGetInsId={handleGetInsId}
                handleGetInsName={handleGetInsName}
                insId={insId}
                insNameId={insNameId}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                type="student"
                date={date}
              />
              <GroupNumber
                handleGetGroupId={handleGetGroupId}
                handleGetGroupName={handleGetGroupName}
                insId={insId}
                groupId={groupId}
                groupNameId={groupNameId}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                type="student"
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
                          <UserImage src={item.face_image} />
                        </div>
                      </td>
                      <td className="name-click" onClick={() => handleNameAbout(item)}>
                        <span>Ism: </span>
                        {item.first_name} {item.last_name} {item.middle_name}
                      </td>
                      <td><span>Sana: </span>{date}</td>
                      <td>
                        <span>Davomat: </span>
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
                ) : (
                  <tr><td style={{ textAlign: 'center' }} colSpan={4}>Ma'lumot topilmadi</td></tr>
                )}
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

export default Attendance;
