import React, { useEffect, useState } from 'react';
import axios from '../service/Api';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function ExpensesType({ activeDropdown, toggleDropdown, handleGetGroupId, selectedTypeName }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          throw new Error('Token mavjud emas');
        }
        const response = await axios.get(`/accounting/expense-type/list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setExpenses(response.data);
        } else {
          setExpenses([]);
        }
        setLoading(false);
      } catch (error) {
        setError("Harajat turlarini olishda xatolik: " + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (id, name) => {
    toggleDropdown('');
    handleGetGroupId(id, name);
  };

  const uniqueExpenses = expenses.length > 0 ? Array.from(
    new Set(expenses.map((expense) => expense.name))
  ).map((name) => {
    return expenses.find((expense) => expense.name === name);
  }) : [];

  return (
    <div className={`group-number ${activeDropdown === 'group-number' ? 'active' : ''}`}>
      <span onClick={() => toggleDropdown('group-number')}>
        {selectedTypeName} <i className={`fa-solid ${activeDropdown === 'group-number' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i>
      </span>
      {activeDropdown === 'group-number' && (
        <div className="dropdown">
          {loading ? (
            <p>Yuklanmoqda...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <Link to="?type=all">
                <p onClick={() => handleClick("", "Hammasi")}>Hammasi</p>
              </Link>
              {uniqueExpenses.map((expense) => (
                <Link key={expense.id} to={`?type=${expense.id}`}>
                  <p onClick={() => handleClick(expense.id, expense.name)}>
                    {expense.name}
                  </p>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ExpensesType;
