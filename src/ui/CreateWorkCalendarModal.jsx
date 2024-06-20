import React, { useState, useEffect } from 'react';

function CreateWorkCalendarModal({ isOpen, onClose, onSubmit, initialData }) {
  const [workerType, setWorkerType] = useState(initialData ? initialData.worker_type : '');
  const [year, setYear] = useState(initialData ? initialData.year : new Date().getFullYear());
  const [month, setMonth] = useState(initialData ? initialData.month : new Date().getMonth() + 1);
  const [selectedDays, setSelectedDays] = useState(new Set(initialData ? initialData.work_days : []));

  useEffect(() => {
    if (!initialData) {
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
    }
  }, [year, month, initialData]);

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
      id: initialData ? initialData.id : undefined,
      worker_type: workerType,
      year: parseInt(year),
      month: parseInt(month),
      work_days: workDays,
    }, !!initialData);
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
          <h2>{initialData ? 'Ish kalendarini yangilash' : 'Ish kalendarini yaratish'}</h2>
          <div className="form-group">
            <label>Ishchi turi</label>
            <select value={workerType} onChange={(e) => setWorkerType(e.target.value)} required disabled={!!initialData}>
              <option value="">Turni tanlang</option>
              <option value="teacher">O'qituvchi</option>
              <option value="educator">Tarbiyachi</option>
              <option value="worker">Ishchi</option>
            </select>
          </div>
          <div className="form-group">
            <label>Yil</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} min="2023" required disabled={!!initialData} />
          </div>
          <div className="form-group">
            <label>Oy</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} required disabled={!!initialData}>
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
            <label>Ish kunlari</label>
            {year && month && renderCalendar()}
          </div>
          <button type="submit">{initialData ? 'Yangilash' : 'Saqlash'}</button>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkCalendarModal;
