import React, { useEffect, useState } from 'react';
import axios from '../service/Api';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

function GroupNumber({ activeDropdown, toggleDropdown, insId, handleGetGroupId, handleGetGroupName, date, type }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupNumber, setGroupNumber] = useState('Guruh sinf raqami');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(`/organizations/educating-groups/?organization=${insId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (insId) {
      fetchData();
    } else {
      fetchData();
    }
  }, [insId]);

  useEffect(() => {
    if (groups.length > 0) {
      const query = new URLSearchParams(window.location.search);
      const groupId = query.get('educating_group');
      if (groupId) {
        const selectedGroup = groups.find(group => group.id === parseInt(groupId));
        if (selectedGroup) {
          setGroupNumber(selectedGroup.name);
        }
      }
    }
  }, [groups]);

  const handleClick = (item) => {
    toggleDropdown('');
    handleGetGroupId(item.id);
    handleGetGroupName(item.name);
    setGroupNumber(item.name);
  }

  return (
    <div className={`group-number ${activeDropdown === 'group-number' ? 'active' : ''}`}>
      <span onClick={() => toggleDropdown('group-number')}>
        {groupNumber} <i className={`fa-solid ${activeDropdown === 'group-number' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i>
      </span>
      <div className="dropdown">
        <Link className='all' to={`?organization=${insId}&educating_group=&${type}&${date}`}>Barchasi</Link>
        {loading ? <p>Yuklanmoqda...</p> : error ? <p>{error}</p> : groups.map(group => (
          <Link to={`?organization=${insId}&educating_group=${group.id}&${type}&${date}`} key={group.id} onClick={() => handleClick(group)}>
            <p>{group.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GroupNumber;
