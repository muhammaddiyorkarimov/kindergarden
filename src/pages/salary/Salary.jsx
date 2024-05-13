// hooks
import { useEffect, useState } from 'react';
// components
import GroupNumber from '../../components/GroupNumber'
import InstitutionType from '../../components/InstitutionType'

// axios
import axios from '../../service/Api';
import { useNavigate } from 'react-router-dom';

function Salary() {

	const [data, setData] = useState([]);
	const [activeDropdown, setActiveDropdown] = useState('');
	const [insId, setInsId] = useState(1);
	const [groupId, setgroupId] = useState(1);
	const [date, setDate] = useState(getCurrentDate());
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [amount, setAmount] = useState('');
	const [selectedDate, setSelectedDate] = useState(getCurrentDate());
	const [paidFull, setPaidFull] = useState(false);
	const [comment, setComment] = useState('')

	// useNavigate
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get(`/accounting/monthly-payments/list/?organization=${insId}&type=worker&${date}`, {
					headers: {
						Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
					}
				});
				setData(response.data.results);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setLoading(false);
			}
		}

		fetchData();
	}, [insId, groupId, date]);


	// 	const requestData = {
	// 		type: "tuition_fee",
	// 		amount: amount,
	// 		year: new Date(selectedDate).getFullYear(),
	// 		month: new Date(selectedDate).getMonth() + 1, // Months are zero-indexed, so we add 1
	// 		is_completed: paidFull,
	// 		comment: comment
	// 	};

	// 	fetch('https://kindergarten-ms.techcraft.uz/api/v1/accounting/monthly-payments/create/', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(requestData)
	// 	})
	// 		.then(response => {
	// 			if (!response.ok) {
	// 				throw new Error('Network response was not ok');
	// 			}
	// 			return response.json();
	// 		})
	// 		.then(data => {
	// 			console.log('Success:', data);
	// 			// Do something if needed after successful submission
	// 		})
	// 		.catch(error => {
	// 			console.error('Error:', error);
	// 			// Handle errors if needed
	// 		});
	// };

	// getCurrentDate
	function getCurrentDate() {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1);
		return `${year} ${month}`;
	}

	// handle get date
	const handleGetDate = (e) => {
		setDate(e.target.value);
	}

	// handle name about
	const handleNameAbout = (id) => {
		navigate(`${id}`)
	}


	const toggleDropdown = (dropdown) => {
		setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
	};
	// handle get ins id
	const handleGetInsId = (id) => {
		setInsId(id);
	};


	const hideModalPayment = () => {
		setShowModal(false);
		setSelectedUser(null);
	};

	const handleModalClick = (e) => {
		if (e.target === e.currentTarget) {
			hideModalPayment();
		}
	};

	return (
		<div className='attendance'>
			<div className="header">
				<div className="a-count">
					<p>Berilgan 25 dan 25</p>
				</div>
				<div className="items">
					<InstitutionType handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
					<div className="select-date">
						<input type='date' onChange={handleGetDate} />
					</div>
				</div>
			</div>
			<div className="body">
				<table>
					<tbody>
						{console.log(data)}
						{data.length > 0 && data.map(item => {
							console.log(item);
							return (
								<tr key={item.id}>
									<td className='name-click' onClick={() => handleNameAbout(item.id)}>{item.first_name} {item.last_name} {item.middle_name}</td>
									<td>{date}</td>
									<td>{item.amount}</td>
									<td>
										<input type="checkbox" />
									</td>
								</tr>
							)
						})}
						{/* {data.length > 0 &&  data.monthly_payments.map(item => {
							return (
								<td></td>
							)
						})} */}
					</tbody>
				</table>
				{data.length === 0 && <div className='loading'><p>Ma'lumot topilmadi</p></div>}
			</div>
		</div>
	)
}

export default Salary