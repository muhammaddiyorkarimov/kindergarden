import { useEffect, useState } from 'react'
import axios from '../../service/Api'
import { useParams } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import Cookies from 'js-cookie';

function PaymentUser() {

	const [data, setData] = useState([])
	const [date, setDate] = useState(getCurrenDate())
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const { id } = useParams()

	useEffect(() => {
		async function fetchData() {
			const token = Cookies.get('access_token');
			try {
				const response = await axios.get(`accounting/monthly-payments/${id}/yearly/?year=${date}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					}
				});
				setLoading(false)
				setData(response.data);
			} catch (error) {
				setLoading(false)
				setError('Error fetching data:' + error.message);
			}
		}

		fetchData();
	}, [date]);

	// getCurrentYear
	function getCurrenDate() {
		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth() < 10 ? ("0" + today.getMonth()) : today.getMonth();
		const day = today.getDay() < 10 ? ("0" + today.getMonth()) : today.getMonth();
		return `${year}-${month}-${day}`;
	}

	// handle get date
	const handleGetDate = (e) => {
		const selectedDate = new Date(e.target.value);
		const year = selectedDate.getFullYear();
		setDate(selectedDate == 'Invalid Date' ? 2000 : year);
	};

	// getmonthName
	function getMonthName(date) {
		const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
			"Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

		const monthIndex = date.getMonth();
		return monthNames[monthIndex];
	}


	return (
		<div className='attendance payment-user'>
			{loading ? <div className="loading">
				<ThreeDots color="#222D32" />
			</div> : error ? <p>{error}</p> : <>
				<div className="header">
					<div className="select-date">
						<span>Yilni kiriting: </span>
						<input defaultValue={getCurrenDate()} type='number' onChange={handleGetDate} />
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
											<td>{date}</td>
											<td>{payment.amount}</td>
											<td>
												{payment.is_completed && <input type="checkbox" defaultChecked={payment.is_completed} style={{ pointerEvents: 'none' }} />}
												{!payment.is_completed && <input type="checkbox" defaultChecked={payment.is_completed} style={{ pointerEvents: 'none' }} />}
											</td>
										</tr>
									)
								})
							) : <tr><td className='user-payment-empty'>Hali to'lov qilinmagan</td></tr>}
						</tbody>
					</table>}
					{data.length === 0 && <div className='loading'><ThreeDots color='#222D32' /></div>}
				</div></>}
		</div>
	)
}

export default PaymentUser