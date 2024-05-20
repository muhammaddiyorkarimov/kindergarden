import React, { useEffect, useState } from "react";
import axios from "../service/Api";
import { ThreeDots } from "react-loader-spinner";
import Cookies from 'js-cookie';

function Statistics() {
	const [data, setData] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const averageAttendanceMapping = {
		kindergartener: "Bog'cha",
		school_student: "Maktab o'quvchilari",
		worker: "Ishchilar",
	};

	const averageSalaryMapping = {
		teachers: "O'qituvchilar",
		kindergarten_educators: "Bog'cha tarbiyachilari",
	};

	const averageTuitionFeeMapping = {
		kindergartens: "Bog'chalar",
		school_students: "Maktab o'quvchilari",
	};

	const usersCountMapping = {
		school_students: "Maktab o'quvchilari",
		teachers: "O'qituvchilar",
		kindergarten_students: "Bog'cha bolalari",
		kindergarten_educators: "Bog'cha tarbiyachilari",
	};

	useEffect(() => {
		async function fetchData() {
			try {
				const token = Cookies.get('access_token');
				const response = await axios.get(`/common/overall-statistics/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					}
				});
				setLoading(false);
				setData(response.data);
			} catch (error) {
				setLoading(false);
				setError("Error fetching data: " + error.message);
			}
		}

		fetchData();
	}, []);

	return (
		<div className="attendance">
			{loading ? (
				<div className="loading">
					<ThreeDots color="#222D32" />
				</div>
			) : error ? <p>{error}</p> : (
				<table>
					<thead>
						<tr>
							<th colSpan={2}>Statistika</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th colSpan={2}>O'rtacha davomat</th>
						</tr>
						{data.average_attendance && Object.entries(data.average_attendance).map(([key, value]) => (
							<tr key={key}>
								<td>{averageAttendanceMapping[key]}</td>
								<td>{value}</td>
							</tr>
						))}
						<tr>
							<th colSpan={2}>O'rtacha ish haqi</th>
						</tr>
						{data.average_salary && Object.entries(data.average_salary).map(([key, value]) => (
							<tr key={key}>
								<td>{averageSalaryMapping[key]}</td>
								<td>{value !== null ? value : 'Mavjud emas'}</td>
							</tr>
						))}
						<tr>
							<th colSpan={2}>O'rtacha o'qish to'lovi</th>
						</tr>
						{data.average_tuition_fee && Object.entries(data.average_tuition_fee).map(([key, value]) => (
							<tr key={key}>
								<td>{averageTuitionFeeMapping[key]}</td>
								<td>{value !== null ? value : 'Mavjud emas'}</td>
							</tr>
						))}
						<tr>
							<th colSpan={2}>Foydalanuvchilar soni</th>
						</tr>
						{data.users_count && Object.entries(data.users_count).map(([key, value]) => (
							<tr key={key}>
								<td>{usersCountMapping[key]}</td>
								<td>{value}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default Statistics;
