import React, { useEffect, useState } from 'react';
import axios from '../service/Api';

function ExpensesType({ activeDropdown, toggleDropdown, expenseId, handleGetGroupId, title }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/accounting/expenses/list/`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
          }
        });

        setExpenses(response.data.results);
        console.log("Expenses fetched:", response.data.results);
      } catch (error) {
        console.error("Error fetching expenses:", error.message);
      }
    };

    fetchData();
  }, [expenseId]);

  const handleClick = (id) => {
    toggleDropdown('');
    handleGetGroupId(id);
  };

  const uniqueExpenses = Array.from(
    new Set(expenses.map((expense) => expense.type.name))
  ).map((name) => {
    return expenses.find((expense) => expense.type.name === name);
  });

  return (
    <div className={`group-number ${activeDropdown === 'group-number' ? 'active' : ''}`}>
      <span onClick={() => toggleDropdown('group-number')}>
        {title} <i className={`fa-solid ${activeDropdown === 'group-number' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i>
      </span>
      {activeDropdown === 'group-number' && (
        <div className="dropdown">
          {uniqueExpenses.map((expense) => (
            <p key={expense.id} onClick={() => handleClick(expense.type.id)}>
              {expense.type.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpensesType;
