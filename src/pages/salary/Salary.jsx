import { useEffect, useState } from 'react';
// components
import InstitutionType from '../../components/InstitutionType';
// axios
import axios from '../../service/Api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';

function Salary() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [data, setData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [insId, setInsId] = useState(1);
  const [date, setDate] = useState(getCurrentDate());
  const [year, setYear] = useState(date.slice(0, 4));
  const [month, setMonth] = useState(date.slice(5));
  const [loading, setLoading] = useState(true);
  const [insNameId, setInsNameId] = useState(queryParams.get('insNameId') || '');
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`accounting/monthly-payments/list/?organization=${insId}&type=worker&year=${year}&month=${month}`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
          }
        });
        setData(response.data.results);
        setPayment(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [insId, year, month]);

  // update URL
  const updateURL = (params) => {
    const queryParams = new URLSearchParams(location.search);
    Object.keys(params).forEach(key => {
      queryParams.set(key, params[key]);
    });
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: false });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('insId', insId);
    params.set('insNameId', insNameId);
    navigate({ search: params.toString() });
  }, [insId, insNameId, navigate]);

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
    updateURL({ organization: id });
  };

  // showModalPayment
  const handleOpenComment = (comment) => {
    alert(comment === '' ? 'Izoh kiritilmagan' : comment);
  };

  return (
    <div className='payment attendance'>
      <div className="header">
        <div className="a-count">
          {payment && insNameId ? (
            <p>To'lov: {payment.count} dan {payment.results.reduce((total, item) => item.monthly_payments.length, 0)}</p>
          ) : (
            <p>Yuklanmoqda...</p>
          )}
        </div>
        <div className="items">
          <InstitutionType handleGetInsName={handleGetInsName} handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
          <div className="select-date">
            <input defaultValue={getCurrentDate()} type='month' onChange={handleGetDate} />
          </div>
        </div>
      </div>
      <div className="body">
        <div className="selected-item-title">
          <span>Muassasa turi: {insNameId}</span>
        </div>
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
                        <input type="checkbox" checked style={{ pointerEvents: 'none' }} /> :
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
    </div>
  );
}

export default Salary;
