import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../service/Api";
import { useNavigate } from "react-router-dom";
import ExpensesType from "../../components/ExpensesType";

function Expenses() {
  const [data, setData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [groupId, setGroupId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `/accounting/expenses/list/?type=${groupId}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I",
            },
          }
        );

        setData(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [groupId]);

  const handleGetGroupId = (id) => {
    setGroupId(id);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleOpenExpense = () => {
    navigate(`/expenses/expensescreate`);
  };

  const filteredData = data.filter((item) => {
    if (!fromDate || !toDate) {
      return true; // If either fromDate or toDate is not set, return all items
    }

    // Parse dates and filter by range
    const itemDate = new Date(item.date);
    const filterFromDate = new Date(fromDate);
    const filterToDate = new Date(toDate);

    return itemDate >= filterFromDate && itemDate <= filterToDate;
  });

  return (
    <div className="attendance">
      {loading ? (
        <div className="loading">
          <ThreeDots color="#222D32" />
        </div>
      ) : (
        <>
          <div className="header">
            <div onClick={handleOpenExpense} className="a-count">
              <p>Harajat qo'shish</p>
            </div>
            <div className="items">
              <ExpensesType
                title="Harajat turi"
                handleGetGroupId={handleGetGroupId}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
              />

              <div className="date-range">
                <label htmlFor="fromDate">From:</label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={handleFromDateChange}
                />
                <label htmlFor="toDate">To:</label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={handleToDateChange}
                />
              </div>
            </div>
          </div>
          <div className="body">
            <table>
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Summa</th>
                  <th>
                    <span>Sana</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="name-click" onClick={() => handleNameAbout(item)}>
                      {item.comment}
                    </td>
                    <td>{item.amount}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="loading">
                <p>Ma'lumot topilmadi</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Expenses;
