import React, { useState } from 'react';

function CreateWorkCalendarModal({ isOpen, onClose, onSubmit }) {
  const [workerType, setWorkerType] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [dailyWorkHours, setDailyWorkHours] = useState('');
  const [selectedDays, setSelectedDays] = useState(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);

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

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDays(new Set());
    } else {
      const daysInMonth = new Date(year, month, 0).getDate();
      const allDays = new Set(Array.from({ length: daysInMonth }, (_, i) => i + 1));
      setSelectedDays(allDays);
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    return (
      <div className="calendar">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={`day ${selectedDays.has(day) ? 'selected' : ''}`}
            onClick={() => handleDayClick(day)}
          >
            {day}
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
            <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} min="1" max="12" required />
          </div>
          <div className="form-group">
            <label>Kunlik ish soati</label>
            <input type="number" value={dailyWorkHours} onChange={(e) => setDailyWorkHours(e.target.value)} min="-2147483648" max="2147483647" required />
          </div>
          <div className="form-group">
            <label>Oylik ish kunlari</label>
            {renderCalendar()}
            <button type="button" onClick={handleSelectAll}>
              {isAllSelected ? 'Bekor qilish' : 'Hammasini tanlash'}
            </button>
          </div>
          <button style={{marginRight: '10px'}} type="submit">Saqlash</button>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkCalendarModal;
