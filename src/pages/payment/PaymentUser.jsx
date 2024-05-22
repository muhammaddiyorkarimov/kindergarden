import { useEffect, useState } from 'react'
import axios from '../../service/Api'
import { useParams } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import Cookies from 'js-cookie';
import './Payment.css'

function PaymentUser() {

	const [data, setData] = useState([])
	const [date, setDate] = useState(getCurrentYear())
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [comments, setComments] = useState([]);

	const { id } = useParams()

	useEffect(() => {
		async function fetchData() {
			try {
				const token = Cookies.get('access_token');
				const response = await axios.get(`accounting/monthly-payments/${id}/yearly/?year=${date}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					}
				});
				setData(response.data);
				setLoading(false);
				const allComments = response.data.monthly_payments.reduce((acc, payment) => {
					if (payment.comment) {
						acc.push(payment.comment);
					}
					return acc;
				}, []);

				setComments(allComments);
			} catch (error) {
				setError('Error fetching data:' + error.message);
				setLoading(false);
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
			{loading ? <div className='loading'>
				<ThreeDots color="#222D32" />
			</div> : error ? <p>{error}</p> : <>
				<div className="header">
					<div className="select-date">
						<span>Yilni kiriting: </span>
						<input defaultValue={getCurrentYear()} type='number' onChange={handleGetDate} />
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
										<>
											<tr key={payment.id}>
												<td>{getMonthName(new Date(payment.paid_month))} </td>
												<td>{payment.amount}</td>
												<td>
													{payment.is_completed && <input type="checkbox" defaultChecked={payment.is_completed} style={{ pointerEvents: 'none' }} />}
													{!payment.is_completed && <input type="checkbox" defaultChecked={payment.is_completed} style={{ pointerEvents: 'none' }} />}
												</td>
											</tr>
											<tr>
												{comments.length > 0 && comments.map(comment => {
													return (
														<td colSpan={3}>Izoh: { comment }</td>
													)
												})}
											</tr>
										</>
									)
								})
							) : <tr><td className='user-payment-empty'>Hali to'lov qilmagan</td></tr>}
						</tbody>
					</table>}
					{data.length === 0 && <div className='loading'><ThreeDots color='#222D32' /></div>}
					{comments.length > 0 && comments.map(comment => {
						<div className='get-comment'>{comment}</div>
					})}
				</div>
			</>}
		</div>
	)
}

export default PaymentUser