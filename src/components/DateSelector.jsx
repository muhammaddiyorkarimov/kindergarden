import React, { useState } from 'react';

const DateSelector = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  return (
    <div>
      <select value={year} onChange={handleYearChange}>
        <option value="">Yilni tanlang</option>
        {/* Yillar ro'yxatini avvaldan yaratish */}
        {Array.from({ length: 10 }, (_, index) => (
          <option key={index} value={2024 - index}>{2024 - index}</option>
        ))}
      </select>
      {year && (
        <select value={month} onChange={handleMonthChange}>
          <option value="">Oy ni tanlang</option>
          {/* Oylar ro'yxatini avvaldan yaratish */}
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index + 1}>{index + 1}</option>
          ))}
        </select>
      )}
      {month && (
        <select value={day} onChange={handleDayChange}>
          <option value="">Kunni tanlang</option>
          {/* Kunlarni ro'yxatini avvaldan yaratish */}
          {Array.from({ length: 31 }, (_, index) => (
            <option key={index} value={index + 1}>{index + 1}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default DateSelector;
