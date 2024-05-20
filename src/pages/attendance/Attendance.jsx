import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../../service/Api";
import "./Attendance.css";
import InstitutionType from "../../components/InstitutionType";
import GroupNumber from "../../components/GroupNumber";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

function Attendance() {
	const navigate = useNavigate();
	const location = useLocation();

	const query = new URLSearchParams(location.search);
	const urlInsId = query.get('organization') || '';
	const urlGroupId = query.get('educating_group') || '';

	const [insId, setInsId] = useState(urlInsId);
	const [groupId, setGroupId] = useState(urlGroupId);
	const [insNameId, setInsNameId] = useState(localStorage.getItem('insNameId') || '');
	const [groupNameId, setGroupNameId] = useState(localStorage.getItem('groupNameId') || '');
	const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || []);
	const [attendance, setAttendance] = useState(JSON.parse(localStorage.getItem('attendance')) || null);
	const [activeDropdown, setActiveDropdown] = useState("");
	const [date, setDate] = useState(localStorage.getItem('date') || getCurrentDate());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [timeoutExpired, setTimeoutExpired] = useState(false);

	useEffect(() => {
		localStorage.setItem('insId', insId);
		localStorage.setItem('groupId', groupId);
		localStorage.setItem('insNameId', insNameId);
		localStorage.setItem('groupNameId', groupNameId);
		localStorage.setItem('date', date);
	}, [insId, groupId, insNameId, groupNameId, date]);

	useEffect(() => {
		const fetchAttendanceData = async (url) => {
			try {
				setLoading(true);
				setError(null);
				setTimeoutExpired(false);

				const token = Cookies.get('access_token');

				const timeout = setTimeout(() => {
					setTimeoutExpired(true);
					setLoading(false);
				}, 4000);

				const response = await axios.get(url, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				clearTimeout(timeout);
				setData(response.data.results);
				setAttendance(response.data);
				setLoading(false);
				localStorage.setItem('data', JSON.stringify(response.data.results));
				localStorage.setItem('attendance', JSON.stringify(response.data));
			} catch (error) {
				setError("Error fetching data: " + error.message);
				setLoading(false);
			}
		};

		if (insId) {
			const url = groupId
				? `/users/attendance/list/?organization=${insId}&educating_group=${groupId}&type=student&date=${date}`
				: `/users/attendance/list/?organization=${insId}&type=student&date=${date}`;
			fetchAttendanceData(url);
		}
	}, [insId, groupId, date]);

	useEffect(() => {
		setInsId(urlInsId);
		setGroupId(urlGroupId);
	}, [urlInsId, urlGroupId]);

	function getCurrentDate() {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	const toggleDropdown = (dropdown) => {
		setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
	};

	const handleGetInsId = (id) => {
		setInsId(id);
		setGroupId('');
		navigate(`/attendance?organization=${id}`);
	};

	const handleGetInsName = (name) => {
		setInsNameId(name);
	};

	const handleGetGroupId = (id) => {
		setGroupId(id);
		navigate(`/attendance?organization=${insId}&educating_group=${id}`);
	};

	const handleGetGroupName = (name) => {
		setGroupNameId(name);
	};

	const handleNameAbout = (item) => {
		navigate(`${item.id}`);
	};

	const handleGetDate = (e) => {
		setDate(e.target.value);
	};

	const handleReload = () => {
		window.location.reload();
	};


	return (
		<div className="attendance">
			{loading ? (
				<div className="loading">
					{timeoutExpired ? (
						<div>
							<button className="reload-btn" onClick={handleReload}>Reload</button>
						</div>
					) : (
						<ThreeDots color="#222D32" />
					)}
				</div>
			) : error ? (
				<div className="error">
					<p>{error}</p>
				</div>
			) : (
				<>
					<div className="header">
						<div className="items">
							<div className="a-count">
								<p>
									Davomat:{" "}
									{groupNameId && insNameId && attendance
										? `${attendance.count} dan ${attendance.total_presences}`
										: insNameId && attendance
											? `${attendance.count} dan ${attendance.total_presences}`
											: ""}
								</p>
							</div>
							<InstitutionType
								handleGetInsId={handleGetInsId}
								handleGetInsName={handleGetInsName}
								insId={insId}
								insNameId={insNameId}
								activeDropdown={activeDropdown}
								toggleDropdown={toggleDropdown}
							/>
							<GroupNumber
								handleGetGroupId={handleGetGroupId}
								handleGetGroupName={handleGetGroupName}
								insId={insId}
								activeDropdown={activeDropdown}
								toggleDropdown={toggleDropdown}
							/>
							<div className="select-date">
								<input type="date" onChange={handleGetDate} value={date} />
							</div>
						</div>
					</div>
					<div className="body">
						<table>
							<thead>
								<tr>
									<th>ISM</th>
									<th>Sana</th>
									<th>Davomat</th>
								</tr>
							</thead>
							<tbody>
								{data.length > 0 ? (
									data.map((item) => (
										<tr key={item.id}>
											<td className="name-click" onClick={() => handleNameAbout(item)}>
												{item.first_name} {item.last_name} {item.middle_name}
											</td>
											<td>{date}</td>
											<td>
												<input
													style={{ pointerEvents: 'none' }}
													type="checkbox"
													checked={item.is_present}
													readOnly
												/>
											</td>
										</tr>
									))
								) : (
									<tr><td style={{ textAlign: 'center' }} colSpan={3}>Ma'lumot topilmadi</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	);
}

export default Attendance;
