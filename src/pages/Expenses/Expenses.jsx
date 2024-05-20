import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../../service/Api";
import { useNavigate, useLocation } from "react-router-dom";
import ExpensesType from "../../components/ExpensesType";
import Cookies from 'js-cookie';

function Expenses() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState(JSON.parse(localStorage.getItem('expensesData')) || []);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [groupId, setGroupId] = useState(localStorage.getItem('expensesGroupId') || "");
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(localStorage.getItem('expensesFromDate') || "");
  const [toDate, setToDate] = useState(localStorage.getItem('expensesToDate') || "");
  const [error, setError] = useState(null);
  const [selectedTypeName, setSelectedTypeName] = useState(localStorage.getItem('selectedTypeName') || "Hammasi");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') || "";
    const name = type ? localStorage.getItem(`expenseTypeName_${type}`) || "Hammasi" : "Hammasi";

    setGroupId(type);
    setSelectedTypeName(name);

    localStorage.setItem('expensesGroupId', type);
    localStorage.setItem('selectedTypeName', name);

    async function fetchData() {
      const token = Cookies.get('access_token');
      try {
        setLoading(true);
        const url = type && type !== "all"
          ? `/accounting/expenses/list/?type=${type}`
          : `/accounting/expenses/list/`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data.results);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      }
    }

    fetchData();
  }, [location.search]);

  useEffect(() => {
    localStorage.setItem('expensesData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('expensesFromDate', fromDate);
  }, [fromDate]);

  useEffect(() => {
    localStorage.setItem('expensesToDate', toDate);
  }, [toDate]);

  const handleGetGroupId = (id, name) => {
    setGroupId(id || "");
    setSelectedTypeName(name || "Hammasi");
    navigate(`?type=${id}`);
    localStorage.setItem('expenseTypeName_' + id, name || "Hammasi");
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

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };

  const filteredData = data.filter((item) => {
    if (!fromDate || !toDate) {
      return true;
    }

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
      ) : error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="header">
            <div className="items">
              <div onClick={handleOpenExpense} className="a-count">
                <p>Harajat qo'shish</p>
              </div>
              <ExpensesType
                selectedTypeName={selectedTypeName}
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
                    <td className="name-click" onClick={() => handleOpenExpense(item)}>
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
