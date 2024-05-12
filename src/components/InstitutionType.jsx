// InstitutionType.jsx
import React, { useEffect, useState } from 'react';
import axios from '../service/Api';

function InstitutionType({ activeDropdown, toggleDropdown, handleGetInsId }) {
	const [institutions, setInstitutions] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get('/organizations/list/', {
					headers: {
						Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
					}
				});
				setInstitutions(response.data);
			} catch (error) {
				console.log(error.message);
			}
		};
		fetchData();
	}, []);

	const handleClick = (id) => {
		handleGetInsId(id);
		toggleDropdown('');
	};

	return (
		<>
			<div className={`type ${activeDropdown === 'type' ? `active` : ''}`}>
				<span onClick={() => toggleDropdown('type')}>Muassasa turi <i className={`fa-solid ${activeDropdown === 'type' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i></span>
				<div className="dropdown">
					{institutions.map(institution => {
						return (
							<p key={institution.id} onClick={() => handleClick(institution.id)}>{institution.name}</p>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default InstitutionType;
