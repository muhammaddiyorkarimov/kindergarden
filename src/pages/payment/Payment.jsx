// hooks
import { useEffect, useState } from 'react';
// components
import GroupNumber from '../../components/GroupNumber'
import InstitutionType from '../../components/InstitutionType'
// css
import './Payment.css'
// axios
import axios from '../../service/Api';
import { useNavigate } from 'react-router-dom';

function Payment() {

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
				const response = await axios.get(`accounting/monthly-payments/list/?organization=${insId}&educating_group=${groupId}&type=student&date=${date}`, {
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

	// handle submit save
	const handleSubmit = () => {
		const selectedDateObject = new Date(selectedDate);
    const year = selectedDateObject.getFullYear(); // Yilni olish
    const month = selectedDateObject.getMonth() + 1;

		const requestData = {
			"type": "tuition_fee",
			"amount": amount,
			"year": year,
			"month": month,
			"is_completed": paidFull,
			"comment": comment
		};

		axios.post('/accounting/monthly-payments/create/', requestData, {
			headers: {
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
			}
		})
			.then(response => {
				console.log('Success:', response.data);
				// Do something if needed after successful submission
			})
			.catch(error => {
				console.error('Error:', error);
				// Handle errors if needed
			});
	};

	// const handleSubmit = () => {
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
	// handle get ins id
	const handleGetGroupId = (id) => {
		setgroupId(id);
	};

	// showModalPayment
	const showModalPayment = (user) => {
		setShowModal(true);
		setSelectedUser(user);
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
		<div className='payment attendance'>
			<div className="header">
				<div className="a-count">
					<p>To'lov: 30 dan 5</p>
				</div>
				<div className="items">
					<InstitutionType handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
					<GroupNumber handleGetGroupId={handleGetGroupId} insId={insId} toggleDropdown={toggleDropdown} activeDropdown={activeDropdown} />
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
							<th>To'langan summa</th>
							<th>To'lov</th>
						</tr>
					</thead>
					<tbody>
						{data.map(item => (
							<tr key={item.id}>
								<td className='name-click' onClick={() => handleNameAbout(item.id)}>{item.first_name} {item.last_name} {item.middle_name}</td>
								<td>{date}</td>
								<td>500 000 so'm</td>
								<td className='td-wrapper'>
									<button onClick={() => showModalPayment(item)}>To'lov</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{data.length === 0 && <div className='loading'><p>Ma'lumot topilmadi</p></div>}
			</div>
			{showModal && (
				<div className="modal" onClick={handleModalClick}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<p className='user-title'>{selectedUser && `${selectedUser.first_name} ${selectedUser.last_name}`}</p>
						<div className="amount">
							<span>To'lov miqdorini kiriting</span>
							<input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
						</div>
						<div className="select-date">
							<span>Oyni tanlang</span>
							<input type='date' value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
						</div>
						<div className="comment">
							<span>Izoh</span>
							<textarea onChange={(e) => setComment(e.target.value)}></textarea>
						</div>
						<div className="paid-full">
							<input type="checkbox" checked={paidFull} onChange={(e) => setPaidFull(e.target.checked)} />
							<span>To'liq to'landi</span>
						</div>
						<button onClick={handleSubmit}>Saqlash</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default Payment