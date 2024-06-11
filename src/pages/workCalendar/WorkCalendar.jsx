import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from '../../service/Api';
import { ThreeDots } from 'react-loader-spinner';
import CreateWorkCalendarModal from './../../ui/CreateWorkCalendarModal';

function WorkCalendar() {
  const [workCalendars, setWorkCalendars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (calendarData) => {
    const token = Cookies.get('access_token');
    try {
      await axios.post('organizations/work-calendar/create/', calendarData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      fetchWorkCalendars(); // Refresh data after submission
    } catch (error) {
      console.error('Error creating work calendar:', error);
      setError('Failed to create work calendar. Please try again.');
    }
  };

  return (
    <div className="work-calendar attendance">
      <div className="calendar-create-wrapper">
        <h2>Work Calendars</h2>
        <button className='calendar-btn' onClick={handleOpenModal}>Create Work Calendar</button>
      </div>
      {isLoading ? (
        <div className="loading">
          <ThreeDots color="#222D32" />
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ishchi turi</th>
              <th>Yil</th>
              <th>Oy</th>
              <th>Kunlik ish soati</th>
              <th>Oylik ish kunlari</th>
            </tr>
          </thead>
          <tbody>
            {workCalendars.map(calendar => (
              <tr key={calendar.id}>
                <td>
                  {calendar.worker_type === 'educator' ? 'Tarbiyachi' :
                    calendar.worker_type === 'teacher' ? "O'qituvchi" :
                    calendar.worker_type === 'worker' ? 'Tarbiyachi' :
                    calendar.worker_type}
                </td>
                <td>{calendar.year}</td>
                <td>{calendar.month}</td>
                <td>{calendar.daily_work_hours}</td>
                <td>{calendar.work_days.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <CreateWorkCalendarModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default WorkCalendar;
