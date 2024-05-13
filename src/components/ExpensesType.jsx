// GroupNumber.jsx
import React, { useEffect, useState } from 'react';
import axios from '../service/Api';

function ExpensesType({ activeDropdown, toggleDropdown, expenseId, handleGetGroupId }) {
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
        console.log(19, response.data.results);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [expenseId]);

	const handleClick = (id) => {
		toggleDropdown('')
    handleGetGroupId(id)
	}


  return (
    <>
      <div className={`group-number ${activeDropdown === 'group-number' ? `active` : ''}`}>
        <span onClick={() => toggleDropdown('group-number')}>Guruh sinf raqami <i className={`fa-solid ${activeDropdown === 'group-number' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i></span>
        <div className="dropdown">
          {expenses.map(expense => {
            return (
              <p key={expense.id} onClick={() => handleClick(expense.type.id)}>{expense.type.name}</p>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ExpensesType;
