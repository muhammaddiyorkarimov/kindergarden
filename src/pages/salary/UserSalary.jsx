import { useEffect, useState } from 'react'
import axios from '../../service/Api'
import { useParams } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';

function UserSalary() {

	const [data, setData] = useState([])
	const [date, setDate] = useState(getCurrentYear())

	const { id } = useParams()

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get(`accounting/monthly-payments/${id}/yearly/?year=${date}`, {
					headers: {
						Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
					}
				});
				setData(response.data);
				// setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				// setLoading(false);
			}
		}

		fetchData();
	}, [date]);

	// getCurrentYear
	function getCurrentYear() {
		const today = new Date();
		const year = today.getFullYear();
		return `${year}`;
	}

	// handle get date
	const handleGetDate = (e) => {
		setDate(getCurrentYear());
	}

	// getmonthName
	function getMonthName(date) {
		const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
			"Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

		const monthIndex = date.getMonth();
		return monthNames[monthIndex];
	}


	return (
		<div className='attendance payment-user'>
			<div className="header">
				<div className="select-date">
					<input type='date' onChange={handleGetDate} />
				</div>
			</div>
			<div className="body">
				{data && data.monthly_payments && <table>
					<thead>
						<tr>
							<th colSpan={4}>{data.first_name} {data.last_name} {data.middle_name}</th>
						</tr>
					</thead>
					<tbody>
						{data && data.monthly_payments && data.monthly_payments.length > 0 ? (
							data.monthly_payments.map(payment => {
								return (
									<tr key={payment.id}>
									<td>{getMonthName(new Date(payment.paid_month))}</td>
									<td>{payment.paid_month}</td>
									<td>{payment.amount}</td>
									<td>
										<input type="checkbox" defaultChecked={payment.is_completed}/>
									</td>
								</tr>
								)
							})
						) :  <tr><td className='user-payment-empty'>Hali maosh olmagan</td></tr>}
					</tbody>
				</table>}
				{data.length === 0 && <div className='loading'><ThreeDots color='#222D32' /></div>}
			</div>
		</div>
	)
}

export default UserSalary