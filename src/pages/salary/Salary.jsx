import { useEffect, useState } from 'react';
// components
import InstitutionType from '../../components/InstitutionType';
// axios
import axios from '../../service/Api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import Cookies from 'js-cookie';

function Salary() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const urlInsId = query.get('organization') || '';

  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || []);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [insId, setInsId] = useState(localStorage.getItem('insId') || '');
  const [date, setDate] = useState(getCurrentDate());
  const [year, setYear] = useState(localStorage.getItem('year') || date.slice(0, 4));
  const [month, setMonth] = useState(localStorage.getItem('month') || date.slice(5));
  const [loading, setLoading] = useState(true);
  const [insNameId, setInsNameId] = useState(localStorage.getItem('insNameId') || '');
  const [payment, setPayment] = useState(JSON.parse(localStorage.getItem('salary')) || null);
  const [error, setError] = useState(null);
  const [timeoutExpired, setTimeoutExpired] = useState(false);

  useEffect(() => {
    localStorage.setItem('insId', insId);
    localStorage.setItem('insNameId', insNameId);
    localStorage.setItem('year', year);
    localStorage.setItem('month', month);
  }, [insId, insNameId, year, month]);

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
        localStorage.setItem('data', JSON.stringify(response.data.results));
        localStorage.setItem('salary', JSON.stringify(response.data));
      } catch (error) {
        setError('Error fetching data:' + error.message);
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
    if (urlInsId) {
      setInsId(urlInsId);
    }
  }, [urlInsId]);

  // getCurrentDate
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // handle get date
  const handleGetDate = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setYear(newDate.slice(0, 4));
    setMonth(newDate.slice(5));
  };

  // handle name about
  const handleNameAbout = (id) => {
    navigate(`${id}`);
  };

  const handleGetInsName = (name) => {
    setInsNameId(name);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
  };

  // handle get ins id
  const handleGetInsId = (id) => {
    setInsId(id);
    navigate(`/salary?organization=${id}`);
  };

  // showModalPayment
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
                {payment && insNameId ? (
                  <p>To'lov: {payment.count} dan {payment.results.reduce((total, item) => item.monthly_payments.length, 0)}</p>
                ) : (
                  <p>Yuklanmoqda...</p>
                )}
              </div>
              <InstitutionType handleGetInsName={handleGetInsName} handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
              <div className="select-date">
                <input defaultValue={getCurrentDate()} type='month' onChange={handleGetDate} />
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
                {data && insNameId ? (
                  data.map(item => (
                    <tr key={item.id}>
                      <td style={{ cursor: 'pointer' }} onClick={() => { handleNameAbout(item.id) }}>{item.first_name} {item.last_name}</td>
                      <td>{date}</td>
                      <td style={{ cursor: 'pointer' }} onClick={() => handleOpenComment(item.monthly_payments.reduce((total, payment) => payment.comment, "To'lov qilinmagan"))}>
                        {item.monthly_payments.reduce((total, payment) => total + parseFloat(payment.amount), 0)}
                      </td>
                      <td>
                        {item.monthly_payments.reduce((total, payment) => (
                          payment.is_completed ?
                            <input type="checkbox" defaultChecked style={{ pointerEvents: 'none' }} /> :
                            <input type="checkbox" style={{ pointerEvents: 'none' }} />
                        ), "To'lanmagan")}
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
