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
        const response = await axios.get(`/accounting/expenses/list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExpenses(response.data.results);
        setLoading(false);
      } catch (error) {
        setError("Error fetching expenses:" + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (id, name) => {
    toggleDropdown('');
    handleGetGroupId(id, name);
  };

  const uniqueExpenses = Array.from(
    new Set(expenses.map((expense) => expense.type.name))
  ).map((name) => {
    return expenses.find((expense) => expense.type.name === name);
  });

  return (
    <div className={`group-number ${activeDropdown === 'group-number' ? 'active' : ''}`}>
      <span onClick={() => toggleDropdown('group-number')}>
        {selectedTypeName} <i className={`fa-solid ${activeDropdown === 'group-number' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i>
      </span>
      {activeDropdown === 'group-number' && (
        <div className="dropdown">
          <Link to="?type=all">
            <p onClick={() => handleClick("", "Hammasi")}>Hammasi</p>
          </Link>
          {uniqueExpenses.map((expense) => (
            <Link key={expense.type.id} to={`?type=${expense.type.id}`}>
              <p onClick={() => handleClick(expense.type.id, expense.type.name)}>
                {expense.type.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpensesType;
