// hooks
import { useEffect, useState } from 'react'
// react loader
import { ThreeDots } from 'react-loader-spinner'

// axios API
import axios from '../../service/Api';

// css
import './Attendance.css';
// components
import InstitutionType from '../../components/InstitutionType';
import GroupNumber from '../../components/GroupNumber';
import { useNavigate } from 'react-router-dom';

function Attendance() {

	// useState
	const [data, setData] = useState([]);
	const [activeDropdown, setActiveDropdown] = useState('');
	const [insId, setInsId] = useState(1);
	const [groupId, setgroupId] = useState(1);
	const [date, setDate] = useState('2024-12-05');
	const [loading, setLoading] = useState(true);

	console.log(data);
	// useNavigate
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get(`/users/attendance/list/?organization=${insId}&educating_group=${groupId}&type=student&date=${date}`, {
					headers: {
						Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
					}
				});
				console.log(response);
				setData(response.data.results);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setLoading(false);
			}
		}

		fetchData();
	}, [insId, groupId, date]);

	// handle get ins id
	const handleGetInsId = (id) => {
		setInsId(id);
	};
	// handle get ins id
	const handleGetGroupId = (id) => {
		setgroupId(id);
	};

	// handle get date
	const handleGetDate = (e) => {
		setDate(e.target.value);
	}

	// toggle dropdown
	const toggleDropdown = (dropdown) => {
		setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
	};

	// handle name about
	const handleNameAbout = (item) => {
		navigate(`${item.id}`)
	}

	return (
		<div className='attendance'>
			{loading ? (<div className='loading'><ThreeDots color='#222D32' /></div>) :
				(<>
					<div className="header">
						<div className="a-count">
							<p>Davomat: 30 dan 28</p>
						</div>
						<div className="items">
							<InstitutionType handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
							<GroupNumber handleGetGroupId={handleGetGroupId} insId={insId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
							<div className="select-date">
								<input type='date' onChange={handleGetDate} />
							</div>
						</div>
					</div>
					<div className="body">
						<table>
							<thead>
								<tr>
									<th>ISM</th>
									<th>Sana</th>
									<th><span>Salom</span></th>
								</tr>
							</thead>
							<tbody>
								{data.map(item => {
									return (
										<tr key={item.id}>
											<td className='name-click' onClick={() => handleNameAbout(item)}>{item.first_name} {item.last_name} {item.middle_name}</td>
											<td>{date}</td>
											<td>
												<input type="checkbox" defaultChecked={item.is_present}/>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
						{data.length === 0 && <div className='loading'><p>Ma'lumot topilmadi</p></div>}
					</div>
				</>)
			}
		</div>
	)
}

export default Attendance