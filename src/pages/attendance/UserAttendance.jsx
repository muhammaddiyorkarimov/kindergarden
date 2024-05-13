// import axios from 'axios';
// axios API
import axios from '../../service/Api';

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


function UserAttendance() {
	const [data, setData] = useState([]);
	const [selectedDate, setSelectedDate] = useState(getCurrentDate());
	const [calendar, setCalendar] = useState([]);
-

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get(`https://kindergarten-ms.techcraft.uz/api/v1/users/attendance/list/?type=student&date=${selectedDate}`, {
					headers: {
						Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
					}
				});
				setData(response.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}

		fetchData();
	}, []);

	useEffect(() => {
    // Hozirgi sana
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const todayString = `${today.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    setSelectedDate(todayString);
    displayMonthAndYear(todayString);
  }, []);

	// getcurrentdate
	function getCurrentDate() {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
}

  const displayMonthAndYear = (inputDate) => {
    const selectedDate = new Date(inputDate);
    const monthNames = ["Yan", "Feb", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
    const month = monthNames[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    const result = month + " " + year;
    setSelectedDate(result);

    // Create calendar for the selected month and year
    const firstDayOfMonth = new Date(year, selectedDate.getMonth(), 1);
    const daysInMonth = new Date(year, selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay(); // Sunday is 0, Monday is 1, ...
    
    const newCalendar = [];
    let week = [];
    // Fill in the empty cells before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push("");
    }
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        newCalendar.push(week);
        week = [];
      }
    }
    // Fill in the remaining empty cells after the last day of the month
    if (week.length > 0) {
      while (week.length < 7) {
        week.push("");
      }
      newCalendar.push(week);
    }

    setCalendar(newCalendar);
  };

  const handleDateChange = (event) => {
    const inputDate = event.target.value;
    setSelectedDate(inputDate);
    displayMonthAndYear(inputDate);
  };


	return (
		<div className='user-attendance'>
			<div className="header">
				<span>Davomat:   30 kundan  dan  28 kun </span>
				<input type="date" id="date" value={selectedDate} onChange={handleDateChange} />
				<div className='selected-date'>{selectedDate}</div>
			</div>
			<div className="name">
				<h1 className="title">{data.first_name} {data.last_name}</h1>
				<div className="user-calender">
					<table>
						<thead>
							<tr>
								<th>Yak</th>
								<th>Du</th>
								<th>Se</th>
								<th>Chor</th>
								<th>Pay</th>
								<th>Jum</th>
								<th>Shan</th>
							</tr>
						</thead>
						<tbody>
							{calendar.map((week, index) => (
								<tr key={index}>
									{week.map((day, index) => (
										<td key={index}>{day}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default UserAttendance