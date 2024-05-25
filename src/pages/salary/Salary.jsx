import { useEffect, useState } from 'react';
import InstitutionType from '../../components/InstitutionType';
import axios from '../../service/Api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import Cookies from 'js-cookie';

function Salary() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const urlInsId = query.get('organization') || '';
  const urlYear = query.get('year') || '';
  const urlMonth = query.get('month') || '';

  const [data, setData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [insId, setInsId] = useState(urlInsId || '');
  const [date, setDate] = useState(getCurrentDate());
  const [year, setYear] = useState(urlYear || date.slice(0, 4));
  const [month, setMonth] = useState(urlMonth || date.slice(5));
  const [loading, setLoading] = useState(true);
  const [insNameId, setInsNameId] = useState('');
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [timeoutExpired, setTimeoutExpired] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = Cookies.get('access_token');
      const timeout = setTimeout(() => {
        setTimeoutExpired(true);
        setLoading(false);
      }, 4000);
      try {
        const response = await axios.get(`accounting/monthly-payments/list/?organization=${insId}&type=worker&year=${year}&month=${month}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        clearTimeout(timeout);
        setData(response.data.results);
        setPayment(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        setLoading(false);
      }
    }

    if (insId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [insId, year, month]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const newInsId = query.get('organization') || '';
    const newYear = query.get('year') || getCurrentDate().slice(0, 4);
    const newMonth = query.get('month') || getCurrentDate().slice(5);

    setInsId(newInsId);
    setYear(newYear);
    setMonth(newMonth);
  }, [location.search]);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  const handleGetDate = (e) => {
    const newDate = e.target.value;
    const newYear = newDate.slice(0, 4);
    const newMonth = newDate.slice(5);
    setDate(newDate);
    setYear(newYear);
    setMonth(newMonth);
    navigate(`/salary?organization=${insId}&year=${newYear}&month=${newMonth}`);
  };

  const handleNameAbout = (id) => {
    navigate(`${id}`);
  };

  const handleGetInsName = (name) => {
    setInsNameId(name);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
  };

  const handleGetInsId = (id) => {
    setInsId(id);
    navigate(`/salary?organization=${id}&type=worker&year=${year}&month=${month}`);
  };

  const handleOpenComment = (comment) => {
    alert(comment === '' ? 'Izoh kiritilmagan' : comment);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className='payment attendance'>
      {loading ? (
        <div className="loading">
          {timeoutExpired ? (
            <div>
              <button className="reload-btn" onClick={handleReload}>Reload</button>
            </div>
          ) : (
            <div className="loading">
              <ThreeDots color="#222D32" />
            </div>
          )}
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
                <p>To'lov: {payment && `${payment.count} dan ${payment.results ? payment.results.reduce((total, item) => item.monthly_payments.length, 0) : 0}`}</p>
              </div>
              <InstitutionType handleGetInsName={handleGetInsName} handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
              <div className="select-date">
                <input defaultValue={`${year}-${month}`} type='month' onChange={handleGetDate} />
              </div>
            </div>
          </div>
          <div className="body">
            <table>
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Sana</th>
                  <th>To'langan Summa (izoh)</th>
                  <th>To'liq to'landimi</th>
                </tr>
              </thead>
              <tbody>
                {data ? (
                  data.map(item => (
                    <tr key={item.id}>
                      <td style={{ cursor: 'pointer' }} onClick={() => { handleNameAbout(item.id) }}>{item.first_name} {item.last_name}</td>
                      <td>{date}</td>
                      <td style={{ cursor: 'pointer' }} onClick={() => handleOpenComment(item.monthly_payments ? item.monthly_payments.reduce((total, payment) => payment.comment, "To'lov qilinmagan") : "To'lov qilinmagan")}>
                        {item.monthly_payments ? item.monthly_payments.reduce((total, payment) => total + parseFloat(payment.amount), 0) : 0}
                      </td>
                      <td>
                        {item.monthly_payments ? item.monthly_payments.reduce((total, payment) => (
                          payment.is_completed ?
                            <input type="checkbox" defaultChecked style={{ pointerEvents: 'none' }} /> :
                            <input type="checkbox" style={{ pointerEvents: 'none' }} />
                        ), "To'lanmagan") : "To'lanmagan"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td style={{ textAlign: 'center' }} colSpan={5}>M'alumot topilmadi</td></tr>
                )}
                <tr>
                  {insNameId && <td colSpan={5}>Ushbu oydagi umumiy summa: <b>{payment ? payment.total_payment : 0}</b></td>}
                </tr>
              </tbody>
            </table>
            {loading && <div style={{ marginTop: '150px' }} className='loading'><ThreeDots color='#222D32' /></div>}
          </div>
        </>
      )}
    </div>
  );
}

export default Salary;
