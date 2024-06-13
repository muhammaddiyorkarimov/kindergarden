import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "../../service/Api";
import { useNavigate, useLocation } from "react-router-dom";
import ExpensesType from "../../components/ExpensesType";
import Cookies from 'js-cookie';

function Expenses() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [groupId, setGroupId] = useState(new URLSearchParams(location.search).get('type') || "");
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(new URLSearchParams(location.search).get('fromDate') || "");
  const [toDate, setToDate] = useState(new URLSearchParams(location.search).get('toDate') || "");
  const [error, setError] = useState(null);
  const [selectedTypeName, setSelectedTypeName] = useState("Hammasi");
  const [allExpenses, setAllExpenses] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') || "";
    const fromDateParam = queryParams.get('fromDate') || "";
    const toDateParam = queryParams.get('toDate') || "";
    const name = type ? "Hammasi" : "Hammasi";

    setGroupId(type);
    setSelectedTypeName(name);
    setFromDate(fromDateParam);
    setToDate(toDateParam);

    async function fetchData() {
      const token = Cookies.get('access_token');
      try {
        setLoading(true);
        const url = type && type !== "all"
          ? `/accounting/expenses/list/?type=${type}&fromDate=${fromDateParam}&toDate=${toDateParam}`
          : `/accounting/expenses/list/?fromDate=${fromDateParam}&toDate=${toDateParam}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllExpenses(response.data);
        setData(response.data.results);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      }
    }

    fetchData();
  }, [location.search]);

  const handleGetGroupId = (id, name) => {
    const newId = id || "";
    const newName = name || "Hammasi";
    setGroupId(newId);
    setSelectedTypeName(newName);
    navigate(`?type=${newId}&fromDate=${fromDate}&toDate=${toDate}`);
  };

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    navigate(`?type=${groupId}&fromDate=${newFromDate}&toDate=${toDate}`);
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
    navigate(`?type=${groupId}&fromDate=${fromDate}&toDate=${newToDate}`);
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

  function formatNumberWithCommas(number) {
    return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
  }


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
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="name-click" onClick={() => handleOpenExpense(item)}>
                      <span>Mahsulot:</span>{item.comment}
                    </td>
                    <td><span>Summa:</span>{formatNumberWithCommas(item.amount)}</td>
                    <td><span>Sana:</span>{item.date}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3}>Umumiy xarajatlar: {formatNumberWithCommas(allExpenses ? allExpenses.total_payment : 0)}</td>
                </tr>
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
