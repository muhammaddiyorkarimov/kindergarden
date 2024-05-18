import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../../service/Api";
import "./Attendance.css";
import InstitutionType from "../../components/InstitutionType";
import GroupNumber from "../../components/GroupNumber";
import { useLocation, useNavigate } from "react-router-dom";

function Attendance() {

  const [insId, setInsId] = useState(localStorage.getItem('insId') || '');
  const [groupId, setGroupId] = useState(localStorage.getItem('groupId') || '');
  const [insNameId, setInsNameId] = useState(localStorage.getItem('insNameId') || '');
  const [groupNameId, setGroupNameId] = useState(localStorage.getItem('groupNameId') || '');
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || []);
  const [attendance, setAttendance] = useState(JSON.parse(localStorage.getItem('attendance')) || null);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [date, setDate] = useState(localStorage.getItem('date') || getCurrentDate());
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('insId', insId);
    localStorage.setItem('groupId', groupId);
    localStorage.setItem('insNameId', insNameId);
    localStorage.setItem('groupNameId', groupNameId);
    localStorage.setItem('date', date);
  }, [insId, groupId, insNameId, groupNameId, date]);

  useEffect(() => {
    if (insId && groupId) {
      async function fetchData() {
        try {
          setLoading(true);
          const response = await axios.get(
            `/users/attendance/list/?organization=${insId}&educating_group=${groupId}&type=student&date=${date}`,
            {
              headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I",
              },
            }
          );
          setData(response.data.results);
          setAttendance(response.data);
          setLoading(false);

          // Save data to local storage
          localStorage.setItem('data', JSON.stringify(response.data.results));
          localStorage.setItem('attendance', JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [insId, groupId, date]);

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
  };

  const handleGetInsName = (name) => {
    setInsNameId(name);
  };

  const handleGetGroupId = (id) => {
    setGroupId(id);
  };

  const handleGetGroupName = (name) => {
    setGroupNameId(name);
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
      ) : (
        <>
          <div className="header">
            <div className="items">
              <div className="a-count">
                <p>Davomat: {groupNameId && insNameId && attendance && `${attendance.count} dan ${attendance.total_presences}`}</p>
              </div>
              <InstitutionType
                handleGetInsId={handleGetInsId}
                handleGetInsName={handleGetInsName}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
              />
              <GroupNumber
                handleGetGroupId={handleGetGroupId}
                handleGetGroupName={handleGetGroupName}
                insId={insId}
                activeDropdown={activeDropdown}
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
                {insNameId && groupNameId ? (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td
                        className="name-click"
                        onClick={() => handleNameAbout(item)}
                      >
                        {item.first_name} {item.last_name} {item.middle_name}
                      </td>
                      <td>{date}</td>
                      <td>
                        <input
                          style={{ pointerEvents: 'none' }}
                          type="checkbox"
                          checked={item.is_present}
                          readOnly
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td style={{ textAlign: 'center' }} colSpan={3}>Ma'lumot topilmadi</td></tr>
                )}
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
