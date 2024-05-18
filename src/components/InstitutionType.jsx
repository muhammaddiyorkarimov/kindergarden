import React, { useEffect, useState } from 'react';
import axios from '../service/Api';
import { Link } from 'react-router-dom';

function InstitutionType({ activeDropdown, toggleDropdown, handleGetInsId, handleGetInsName }) {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insType, setInsType] = useState('Muassasa turi');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/organizations/list/', {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
          }
        });
        setInstitutions(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

	useEffect(() =>  {
		
	}, [])

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
        {loading ? <p>Yuklanmoqda...</p> : institutions.map(institution => (
          <Link to={`?organization=${institution.id}`} key={institution.id} onClick={() => handleClick(institution)}>
            <p>{institution.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default InstitutionType;
