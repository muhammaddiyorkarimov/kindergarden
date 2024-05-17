import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../../service/Api";
import "./Attendance.css";
import InstitutionType from "../../components/InstitutionType";
import GroupNumber from "../../components/GroupNumber";
import { useLocation, useNavigate } from "react-router-dom";

function Attendance({ inputValue, setFilterData }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [insId, setInsId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [insNameId, setInsNameId] = useState('');
  const [groupNameId, setGroupNameId] = useState('');
  const [data, setData] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [date, setDate] = useState(getCurrentDate());
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (queryParams.get('insId') && queryParams.get('groupId')) {
      setInsId(queryParams.get('insId'));
      setGroupId(queryParams.get('groupId'));
      setInsNameId(queryParams.get('insNameId') || '');
      setGroupNameId(queryParams.get('groupNameId') || '');
    }
  }, [location.search]);

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
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }

      fetchData();
    }
  }, [insId, groupId, date]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (insId) params.set('insId', insId);
    if (groupId) params.set('groupId', groupId);
    if (insNameId) params.set('insNameId', insNameId);
    if (groupNameId) params.set('groupNameId', groupNameId);
    navigate({ search: params.toString() });
  }, [insId, groupId, insNameId, groupNameId, navigate]);

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

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.first_name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilterData(filtered);
  }, [data, inputValue, setFilterData]);

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
            <div className="selected-item-title">
              <span>Muassasa turi: {insNameId}</span>
              <span>Guruh sinf raqami: {groupNameId}</span>
              <span>Sana: {date}</span>
            </div>
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
