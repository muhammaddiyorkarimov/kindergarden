import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from '../../service/Api';
import { ThreeDots } from 'react-loader-spinner';
import CreateWorkCalendarModal from './../../ui/CreateWorkCalendarModal';
import { Alert, AlertTitle } from "@mui/material";
// import './WorkCalendar.css';

function WorkCalendar() {
  const [workCalendars, setWorkCalendars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingCalendar, setEditingCalendar] = useState(null);

  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

  const fetchWorkCalendars = async () => {
    const token = Cookies.get('access_token');
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('organizations/work-calendar/list/', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setWorkCalendars(response.data.results);
    } catch (error) {
      console.error('Error fetching work calendars:', error);
      setError('Failed to fetch work calendars. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkCalendars();
  }, []);

  const handleOpenModal = (calendar) => {
    setEditingCalendar(calendar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCalendar(null);
  };

  const handleSubmit = async (calendarData, isEdit) => {
    const token = Cookies.get('access_token');

    try {
      if (isEdit) {
        await axios.put(`organizations/work-calendar/${calendarData.id}/update/`, calendarData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setSuccessMessage('Work calendar updated successfully!');
      } else {
        await axios.post('organizations/work-calendar/create/', calendarData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setSuccessMessage('Work calendar created successfully!');
      }
      fetchWorkCalendars(); // Refresh data after submission
      setTimeout(() => setSuccessMessage(null), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error('Error submitting work calendar:', error);
      setError('Failed to submit work calendar. Please try again.');
    }
  };

  const isPastMonth = (year, month) => {
    const now = new Date();
    const calendarDate = new Date(year, month - 1);
    return calendarDate < new Date(now.getFullYear(), now.getMonth());
  };

  return (
    <div className="work-calendar attendance">
      <div className="calendar-create-wrapper">
        <h2>Work Calendars</h2>
        <button className='calendar-btn' onClick={() => handleOpenModal(null)}>Create Work Calendar</button>
      </div>
      {successMessage && (
        <Alert severity="success" style={{ position: 'fixed', backgroundColor: 'green', color: 'white' }}>
          <AlertTitle>Success</AlertTitle>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" style={{ backgroundColor: 'green', color: 'white' }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {isLoading ? (
        <div className="loading">
          <ThreeDots color="#222D32" />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ishchi turi</th>
              <th>Yil</th>
              <th>Oy</th>
              <th>Oylik ish kunlari</th>
              <th>Yangilash</th>
            </tr>
          </thead>
          <tbody>
            {workCalendars.length === 0 ? (
              <tr>
                <td style={{ textAlign: 'center' }} colSpan={5}>
                  Ma'lumot topilmadi
                </td>
              </tr>
            ) : (
              workCalendars.map(calendar => (
                <tr key={calendar.id}>
                  <td>
                    <span>Ishchi turi:</span>
                    {calendar.worker_type === 'educator' ? 'Tarbiyachi' :
                      calendar.worker_type === 'teacher' ? "O'qituvchi" :
                          calendar.worker_type}
                  </td>
                  <td><span>Yil:</span>{calendar.year}</td>
                  <td><span>Oy:</span>{monthNames[calendar.month - 1]}</td>
                  <td><span>Oylik ish soati:</span>{calendar.work_days.join(', ')}</td>
                  <td className='calendar-btn2'>
                    <button
                      className='calendar-btn'
                      onClick={() => handleOpenModal(calendar)}
                      disabled={isPastMonth(calendar.year, calendar.month)}
                    >
                      Yangilash
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <CreateWorkCalendarModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editingCalendar}
        />
      )}
    </div>
  );
}

export default WorkCalendar;
