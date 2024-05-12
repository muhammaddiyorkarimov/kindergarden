// GroupNumber.jsx
import React, { useEffect, useState } from 'react';
import axios from '../service/Api';

function GroupNumber({ activeDropdown, toggleDropdown, insId, handleGetGroupId }) {
  const [groups, setGroups] = useState([]);
  console.log(insId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/organizations/educating-groups/?organization=${insId}`, {
          headers: {
						Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
					}
        });
        
        setGroups(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [insId]);

	const handleClick = (id) => {
		toggleDropdown('')
    handleGetGroupId(id)
	}


  return (
    <>
      <div className={`group-number ${activeDropdown === 'group-number' ? `active` : ''}`}>
        <span onClick={() => toggleDropdown('group-number')}>Guruh sinf raqami <i className={`fa-solid ${activeDropdown === 'group-number' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i></span>
        <div className="dropdown">
          {groups.map(group => {
            return (
              <p key={group.id} onClick={() => handleClick(group.id)}>{group.name}</p>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default GroupNumber;