// GroupNumber.jsx
import React, { useEffect, useState } from 'react';
import axios from '../service/Api';
import { Link } from 'react-router-dom';

function GroupNumber({ activeDropdown, toggleDropdown, insId, handleGetGroupId, handleGetGroupName }) {
  const [groups, setGroups] = useState([]);
  const [getInsId, setGetInsId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/organizations/educating-groups/?organization=${insId}`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
          }
        });
        setGetInsId(insId)
        setGroups(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [insId]);

  const handleClick = (item) => {
    toggleDropdown('')
    handleGetGroupId(item.id)
    handleGetGroupName(item.name)
  }


  return (
    <>
      <div className={`group-number ${activeDropdown === 'group-number' ? `active` : ''}`}>
        <span onClick={() => toggleDropdown('group-number')}>Guruh sinf raqami <i className={`fa-solid ${activeDropdown === 'group-number' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i></span>
        <div className="dropdown">
          {groups.map(group => {
            return (
              <Link to={`/attendance?organization=${getInsId}&educating_group=${group.id}`} key={group.id} onClick={() => handleClick(group)}>
                <p>{group.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default GroupNumber;
