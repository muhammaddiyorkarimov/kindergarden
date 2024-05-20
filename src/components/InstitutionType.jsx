import React, { useEffect, useState } from 'react';
import axios from '../service/Api';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function InstitutionType({ insId, insNameId, activeDropdown, toggleDropdown, handleGetInsId, handleGetInsName }) {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insType, setInsType] = useState(insNameId || 'Muassasa turi');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get('/organizations/list/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setInstitutions(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (insNameId) {
      setInsType(insNameId);
    }
  }, [insNameId]);

  const handleClick = (item) => {
    setInsType(item.name);
    handleGetInsId(item.id);
    handleGetInsName(item.name);
    toggleDropdown('');
  };

  return (
    <div className={`type ${activeDropdown === 'type' ? `active` : ''}`}>
      <span onClick={() => toggleDropdown('type')}>
        {insType} <i className={`fa-solid ${activeDropdown === 'type' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i>
      </span>
      <div className="dropdown">
        {loading ? <p>Yuklanmoqda...</p> : error ? <p>{error}</p> : institutions.map(institution => (
          <Link to={`?organization=${institution.id}`} key={institution.id} onClick={() => handleClick(institution)}>
            <p>{institution.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default InstitutionType;
