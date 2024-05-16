import React, { useEffect, useState } from 'react';
import axios from '../../service/Api';
import { useParams } from 'react-router-dom';

import './Attendance.css'

function UserAttendance() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [calendar, setCalendar] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/users/${id}/monthly-attendance/?year=2024&month=05`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const todayString = `${today.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    setSelectedDate(todayString);
    displayMonthAndYear(todayString);
  }, []);

  const displayMonthAndYear = (inputDate) => {
    const selectedDate = new Date(inputDate);
    const monthNames = ["Yan", "Feb", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
    const month = monthNames[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    const result = month + " " + year;
    setSelectedDate(result);

    const firstDayOfMonth = new Date(year, selectedDate.getMonth(), 1);
    const daysInMonth = new Date(year, selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const newCalendar = [];
    let week = [];
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

    const year = inputDate.substring(0, 4);
    const month = inputDate.substring(5, 7);

    fetchData(year, month);
  };

  const fetchData = async (year, month) => {
    try {
      const response = await axios.get(`/users/${id}/monthly-attendance/?year=${year}&month=${month}`, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const selectedMonthDaysCount = calendar.reduce((acc, week) => acc + week.filter(day => !!day).length, 0);

  return (
    <div className='attendance user-attendance'>
      <div className="header">
        <span>Davomat: {selectedMonthDaysCount} {calendar.length && `kundan dan ${data.total_attended_days}`}</span>
        <input type="date" id="date" value={selectedDate} onChange={handleDateChange} />
        <div className='selected-date'>{selectedDate}</div>
      </div>
      <div className="name">
        {data.user && <h1 className="title">{data.user.first_name} {data.user.middle_name} {data.user.last_name}</h1>}
        <div className="user-calendar">
          <div className="calendar-header">
            <div>Yak</div>
            <div>Du</div>
            <div>Se</div>
            <div>Chor</div>
            <div>Pay</div>
            <div>Jum</div>
            <div>Shan</div>
          </div>
          <div className="calendar-body">
            {calendar.map((week, weekIndex) => (
              <div className="calendar-week" key={weekIndex}>
                {week.map((day, dayIndex) => (
                  <div
                    className="calendar-day"
                    key={dayIndex}
                    style={{
                      color: data.attended_days && data.attended_days.includes(day) ? 'green' : 'red',
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserAttendance;
