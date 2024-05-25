import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { v4 as uuidv4 } from 'uuid';
import axios from "../service/Api";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

function Income() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(new URLSearchParams(location.search).get('fromDate') || getDefaultFromDate());
  const [toDate, setToDate] = useState(new URLSearchParams(location.search).get('toDate') || getDefaultToDate());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);

  function getDefaultFromDate() {
    const today = new Date();
    today.setMonth(today.getMonth() - 24);
    return formatDate(today);
  }

  function getDefaultToDate() {
    return formatDate(new Date());
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    navigate(`?fromDate=${newFromDate}&toDate=${toDate}`);
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
    navigate(`?fromDate=${fromDate}&toDate=${newToDate}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(
          `/accounting/income/monthly/?from_date=${fromDate}&to_date=${toDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        setData(response.data);
        setTotalIncome(response.data.total_income);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    fetchData();
  }, [fromDate, toDate]);

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
              <div className="a-count">
                Umumiy summa: {totalIncome}
              </div>
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
                  <th>Izoh</th>
                  <th>To'lovlar</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                {data.monthly_incomes.length ? (data.monthly_incomes.map(item => (
                  <tr key={uuidv4()}>
                    <td>{item.organization_type === 'school' ? "Maktab to'lovlari" : "Bog'cha to'lovlari"}</td>
                    <td>{item.total}</td>
                    <td>{item.year_month}</td>
                  </tr>
                ))) : <tr><td style={{ textAlign: 'center' }} colSpan={3}>Ma'lumot topilmadi</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Income;
