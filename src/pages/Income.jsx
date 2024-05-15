// hooks
import { useEffect, useState } from "react";
// react loader
import { ThreeDots } from "react-loader-spinner";
// uuid
import { v4 as uuidv4 } from 'uuid';

// axios API
import axios from "../service/Api";

function Income() {
	// useState
	const [data, setData] = useState([]);
	const [fromDate, setFromDate] = useState(getDefaultFromDate());
	const [toDate, setToDate] = useState(getDefaultToDate());
	const [loading, setLoading] = useState(true);
	const [activeDropdown, setActiveDropdown] = useState('');
	const [organizationType, setOrganizationType] = useState('');
	const [totalIncome, setTotalIncome] = useState(0);

	function getDefaultFromDate() {
		const today = new Date();
		today.setMonth(today.getMonth() - 12);
		return formatDate(today);
	}

	function getDefaultToDate() {
		return formatDate(new Date());
	}

	function formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	const handleFromDateChange = (e) => {
		setFromDate(e.target.value);
	};

	const handleToDateChange = (e) => {
		setToDate(e.target.value);
	};

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get(
					`/accounting/income/monthly/?from_date=${fromDate}&to_date=${toDate}`,
					{
						headers: {
							Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
						}
					}
				);
				const filteredData = organizationType
					? response.data.filter(item => item.organization_type === organizationType)
					: response.data;
				const total = filteredData.reduce((acc, item) => acc + item.total, 0);
				setTotalIncome(total);
				setData(filteredData);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setLoading(false);
			}
		}

		fetchData();
	}, [fromDate, toDate, organizationType]); // Update the useEffect dependencies to include fromDate, toDate, and organizationType

	const toggleDropdown = (dropdown) => {
		setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
	};

	const handleOrganizationTypeChange = (type) => {
		setOrganizationType(type);
		setActiveDropdown('');
	};

	return (
		<div className="attendance">
			{loading ? (
				<div className="loading">
					<ThreeDots color="#222D32" />
				</div>
			) : (
				<>
					<div className="header">
						<div className="a-count">
							<span className="organization-type" onClick={() => toggleDropdown('organization-type')}>Tashkilot turi: <i
								className={`fa-solid ${activeDropdown === 'organization-type' ? 'fa-chevron-down' : 'fa-chevron-left'}`}
								style={{ width: '30px', fontSize: '15px', paddingLeft: '10px' }}
							></i></span>
							{activeDropdown === 'organization-type' && (
								<div className="organization-dropdown">
									<p onClick={() => handleOrganizationTypeChange('school')}>Maktab</p>
									<p onClick={() => handleOrganizationTypeChange('kindergarten')}>Bog'cha</p>
									<p onClick={() => handleOrganizationTypeChange('')}>Hammasi</p>
								</div>
							)}
						</div>
						<div className="items">
							<div className="date-range">
								<label htmlFor="fromDate">From:</label>
								<input
									type="date"
									id="fromDate"
									value={fromDate}
									onChange={handleFromDateChange}
								/>
								<label htmlFor="toDate">To:</label>
								<input
									type="date"
									id="toDate"
									value={toDate}
									onChange={handleToDateChange}
								/>
							</div>
						</div>
					</div>
					<div className="body">
						<table>
							<thead>
								<tr>
									<th>Izoh</th>
									<th>To'lovlar</th>
									<th>Sana</th>
								</tr>
							</thead>
							<tbody>
								{data.length ? (data.map(item => (
									<tr key={uuidv4()}>
										<td>{item.organization_type === 'school' ? "Maktab to'lovlari" : "Bog'cha to'lovlari"}</td>
										<td>{item.total}</td>
										<td>{item.year_month}</td>
									</tr>
								))) : <tr><td style={{ textAlign: 'center' }} colSpan={3}>Ma'lumot topilmadi</td></tr>}
								<tr>
									<td colSpan={3}>Umumiy summa: {totalIncome}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	);
}

export default Income;
