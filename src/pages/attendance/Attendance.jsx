// hooks
import { useEffect, useState } from 'react'

// axios API
import axios from '../../service/Api';

// css
import './Attendance.css';

function Attendance() {

	const [data, setData] = useState([]);
	const [groups, setGroups] = useState([]);
	const [institutions, setInstitutions] = useState([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get('http://localhost:3000/data');
				setData(response.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				
				const response = await axios.get('/organizations/educating-groups/')
				setGroups(response.data);
			} catch (error) {
				console.log(error.message);
			}
		}
		fetchData()
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get('/organizations/list/')
				setInstitutions(response.data);
				console.log(response.data);
			} catch (error) {
				console.log(error.message);
			}
		}
		fetchData()
	}, [])


	const [activeDropdown, setActiveDropdown] = useState('');

	const toggleDropdown = (dropdown) => {
		setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
	};

	return (
		<div className='attendance'>
			<div className="header">
				<div className="a-count">
					<p>Davomat: 30 dan 28</p>
				</div>
				<div className="items">
					<div className={`type ${activeDropdown === 'type' ? `active` : ''}`}>
						<span onClick={() => toggleDropdown('type')}>Muassasa turi <i className={`fa-solid ${activeDropdown === 'type' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i></span>
						<div className="dropdown">
						{institutions.map(institution => {
							return (
									<p key={institution.id} >{institution.name}</p>
								)
							})}
							</div>

					</div>
					<div className={`group-number ${activeDropdown === 'group-number' ? `active` : ''}`}>
						<span onClick={() => toggleDropdown('group-number')}>Guruh sinf raqami <i className={`fa-solid ${activeDropdown === 'group-number' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i></span>
						<div className="dropdown">
						{groups.map(group => {
							return (
									<p key={group.id}>{group.name}</p>
							)
						})}
								</div>
					</div>
					<div className="select-date">
						<input type='date' />
					</div>
				</div>
			</div>
			<div className="body">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>ISM</th>
							<th>Sana</th>
							<th><span>Salom</span></th>
						</tr>
					</thead>
					<tbody>
						{data.map(item => (
							<tr key={item.id}>
								<td>{item.id}</td>
								<td>{item.ism}</td>
								<td>{item.sana}</td>
								<td>
									<input type="checkbox" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Attendance