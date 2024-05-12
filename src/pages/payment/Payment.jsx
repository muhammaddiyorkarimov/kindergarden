// hooks
import { useEffect, useState } from 'react';
// components
import GroupNumber from '../../components/GroupNumber'
import InstitutionType from '../../components/InstitutionType'
// css
import './Payment.css'
// axios
import axios from '../../service/Api';

function Payment() {

	const [data, setData] = useState([]);
	const [activeDropdown, setActiveDropdown] = useState('');
	const [insId, setInsId] = useState(1);
	const [groupId, setgroupId] = useState(1);
	const [date, setDate] = useState('2024-12-05');
	const [loading, setLoading] = useState(true);

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

	// handle get date
	const handleGetDate = (e) => {
		setDate(e.target.value);
	}


  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
  };
	// handle get ins id
	const handleGetInsId = (id) => {
		setInsId(id);
	};
	// handle get ins id
	const handleGetGroupId = (id) => {
		setgroupId(id);
	};

	// showModalPayment
	const showModalPayment = () => {
		
	}

	return (
		<div className='payment attendance'>
			<div className="header">
				<div className="a-count">
					<p>To'lov: 30 dan 5</p>
				</div>
				<div className="items">
					<InstitutionType handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
					<GroupNumber handleGetGroupId={handleGetGroupId} insId={insId} toggleDropdown={toggleDropdown} activeDropdown={activeDropdown}/> 
					<div className="select-date">
						<input type='date' onChange={handleGetDate}/>
					</div>
				</div>
			</div>
			<div className="body">
						<table>
							<thead>
								<tr>
									<th>ISM</th>
									<th>Sana</th>
									<th>To'langan summa</th>
									<th>To'lov</th>
								</tr>
							</thead>
							<tbody>
								{data.map(item => {
									return (
										<tr key={item.id}>
											<td className='name-click' onClick={() => handleNameAbout(item)}>{item.first_name} {item.last_name} {item.middle_name}</td>
											<td>{date}</td>
											<td>500 000 so'm</td>
											<td className='td-wrapper'>
												{/* <input type="checkbox" defaultChecked={item.is_present}/> */}
												<button onClick={showModalPayment}>To'lov</button>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
						{data.length === 0 && <div className='loading'><p>Ma'lumot topilmadi</p></div>}
					</div>
		</div>
	)
}

export default Payment