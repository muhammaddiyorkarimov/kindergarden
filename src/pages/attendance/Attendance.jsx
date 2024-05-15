// hooks
import { useEffect, useState } from "react";
// react loader
import { ThreeDots } from "react-loader-spinner";

// axios API
import axios from "../../service/Api";

// css
import "./Attendance.css";
// components
import InstitutionType from "../../components/InstitutionType";
import GroupNumber from "../../components/GroupNumber";
import { useNavigate } from "react-router-dom";

function Attendance({ inputValue, setFilterData }) {
  // useState
  const [data, setData] = useState([]);
  const [attendance, setAttendance] = useState('')
  const [activeDropdown, setActiveDropdown] = useState("");
  const [insId, setInsId] = useState(1);
  const [insNameId, setInsNameId] = useState('');
  const [groupId, setgroupId] = useState(1);
  const [groupNameId, setGroupNameId] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  const [loading, setLoading] = useState(true);

  // useNavigate
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `/users/attendance/list/?organization=${insId}&educating_group=${groupId}&type=student&date=${date}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I",
            },
          }
        );
        setData(response.data.results);
        setAttendance(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [insId, groupId, date]);

  // getCurrentDate
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // toggle dropdown
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };

  // handle get ins id
  const handleGetInsId = (id) => {
    setInsId(id);
  };
  const handleGetInsName = (name) => {
    setInsNameId(name)
  }
  // handle get group id
  const handleGetGroupId = (id) => {
    setgroupId(id);
  };
  const handleGetGroupName = (name) => {
    setGroupNameId(name);
  }

  // handle name about
  const handleNameAbout = (item) => {
    navigate(`${item.id}`);
  };

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.first_name.toLowerCase().includes(inputValue)
    );
    setFilterData(filtered);
  }, [data, inputValue]);

  // handle get date
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
            <div className="a-count">
              <p>Davomat: {groupNameId && insNameId && `${attendance.count} dan ${attendance.total_presences}`}</p>
            </div>
            <div className="items">
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
                <input type="date" onChange={handleGetDate} />
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
                  data.map((item) => {
                    return (
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
                            defaultChecked={item.is_present}
                          />
                        </td>
                      </tr>
                    );
                  })
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
