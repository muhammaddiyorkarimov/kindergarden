import React, { useState, useEffect } from 'react';

function CreateWorkCalendarModal({ isOpen, onClose, onSubmit }) {
  const [workerType, setWorkerType] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dailyWorkHours, setDailyWorkHours] = useState('');
  const [selectedDays, setSelectedDays] = useState(new Set());

  useEffect(() => {
    const initializeSelectedDays = () => {
      const newSelectedDays = new Set();
      const daysInMonth = new Date(year, month, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = new Date(year, month - 1, day).getDay();
        if (dayOfWeek !== 0) { // Exclude Sundays initially
          newSelectedDays.add(day);
        }
      }

      setSelectedDays(newSelectedDays);
    };

    if (year && month) {
      initializeSelectedDays();
    }
  }, [year, month]);

  if (!isOpen) return null;

  const handleDayClick = (day) => {
    const newSelectedDays = new Set(selectedDays);
    if (newSelectedDays.has(day)) {
      newSelectedDays.delete(day);
    } else {
      newSelectedDays.add(day);
    }
    setSelectedDays(newSelectedDays);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workerType) {
      alert("Ishchi turi tanlanishi shart");
      return;
    }
    const workDays = Array.from(selectedDays);
    onSubmit({
      worker_type: workerType,
      year: parseInt(year),
      month: parseInt(month),
      daily_work_hours: parseInt(dailyWorkHours),
      work_days: workDays,
    });
    onClose();
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const weeks = [];
    let week = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    const dayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'];

    return (
      <div className="calendar">
        <div className="calendar-row header">
          {dayNames.map((dayName, index) => (
            <div key={index} className="day-name">
              {dayName}
            </div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-row">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`day ${day ? (selectedDays.has(day) ? 'selected' : '') : 'empty'}`}
                onClick={() => day && handleDayClick(day)}
                style={{
                  backgroundColor: day
                    ? selectedDays.has(day)
                      ? 'green'
                      : 'red'
                    : 'white',
                  color: 'white'
                }}
              >
                {day}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          <h2>Ish kalendarini yaratish</h2>
          <div className="form-group">
            <label>Ishchi turi</label>
            <select value={workerType} onChange={(e) => setWorkerType(e.target.value)} required>
              <option value="">Turni tanlang</option>
              <option value="teacher">O'qituvchi</option>
              <option value="worker">Tarbiyachi</option>
            </select>
          </div>
          <div className="form-group">
            <label>Yil</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} min="2023" required />
          </div>
          <div className="form-group">
            <label>Oy</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} required>
              <option value="1">Yanvar</option>
              <option value="2">Fevral</option>
              <option value="3">Mart</option>
              <option value="4">Aprel</option>
              <option value="5">May</option>
              <option value="6">Iyun</option>
              <option value="7">Iyul</option>
              <option value="8">Avgust</option>
              <option value="9">Sentabr</option>
              <option value="10">Oktabr</option>
              <option value="11">Noyabr</option>
              <option value="12">Dekabr</option>
            </select>
          </div>
          <div className="form-group">
            <label>Kunlik ish soati</label>
            <input type="number" value={dailyWorkHours} onChange={(e) => setDailyWorkHours(e.target.value)} min="0" required />
          </div>
          <div className="form-group">
            <label>Ish kunlari</label>
            {year && month && renderCalendar()}
          </div>
          <button type="submit">Saqlash</button>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkCalendarModal;