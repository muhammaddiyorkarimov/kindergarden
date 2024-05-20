import Cookies from 'js-cookie';
// hooks
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// components
import GroupNumber from '../../components/GroupNumber';
import InstitutionType from '../../components/InstitutionType';
// css
import './Payment.css';
// axios
import axios from '../../service/Api';
import { ThreeDots } from 'react-loader-spinner';
// material ui
import { Alert, AlertTitle } from "@mui/material";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const urlInsId = query.get('organization') || '';
  const urlGroupId = query.get('educating_group') || '';

  const [insId, setInsId] = useState(urlInsId || localStorage.getItem('insId') || '');
  const [groupId, setGroupId] = useState(urlGroupId || localStorage.getItem('groupId') || '');
  const [insNameId, setInsNameId] = useState(localStorage.getItem('insNameId') || '');
  const [groupNameId, setGroupNameId] = useState(localStorage.getItem('groupNameId') || '');
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || []);
  const [date, setDate] = useState(localStorage.getItem('date') || getCurrentDate());
  const [year, setYear] = useState(date.slice(0, 4));
  const [month, setMonth] = useState(date.slice(5));
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [paidFull, setPaidFull] = useState(false);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState(1);
  const [userId2, setUserId2] = useState(1);
  const [payment, setPayment] = useState('');
  const [getFirstPayment, setGetFirstPayment] = useState(0);
  const [openComment, setOpenComment] = useState('');
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [activeDropdown, setActiveDropdown] = useState('');

  // access token
  const token = Cookies.get('access_token');

  useEffect(() => {
    localStorage.setItem('insId', insId);
    localStorage.setItem('groupId', groupId);
    localStorage.setItem('insNameId', insNameId);
    localStorage.setItem('groupNameId', groupNameId);
    localStorage.setItem('date', date);
  }, [insId, groupId, insNameId, groupNameId, date]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(
          `accounting/monthly-payments/list/?organization=${insId}&educating_group=${groupId}&type=student&year=${year}&month=${month}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        setData(response.data.results);
        setPayment(response.data);
        setLoading(false);
        localStorage.setItem('data', JSON.stringify(response.data.results));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      }
    }

    if (insId) {
      fetchData();
    }
  }, [insId, groupId, year, month]);

  useEffect(() => {
    setInsId(urlInsId);
    setGroupId(urlGroupId);
  }, [urlInsId, urlGroupId]);

  const handleSubmit = () => {
    const requestData = {
      user: userId,
      type: "tuition_fee",
      amount: amount,
      month: month,
      year: year,
      is_completed: paidFull,
      comment: comment
    };

    axios.post('/accounting/monthly-payments/create/', requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setShowModal(false);
        setAlertType('success');
        setAlertMessage('Muvaffaqiyatli qo\'shildi');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        setError(error);
        setShowAlert(true);
        setShowModal(false);
        setAlertType('error');
        setAlertMessage(error.message);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      });
  };

  const handleSubmit2 = () => {
    const updatedData = {
      user: userId2,
      amount: parseInt(amount) + getFirstPayment,
      is_completed: paidFull,
      comment: comment
    };

    axios.patch(`/accounting/monthly-payments/${userId2}/update/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setShowModal2(false);
        setAlertType('success');
        setAlertMessage('Muvaffaqiyatli yangilandi');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        console.error('Error:', error);
        setShowModal2(false);
        setError(error);
        setShowAlert(true);
        setShowModal(false);
        setAlertType('error');
        setAlertMessage(error.message);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      });
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  const handleGetDate = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setYear(newDate.slice(0, 4));
    setMonth(newDate.slice(5));
  };

  const handleNameAbout = (id) => {
    navigate(`${id}`);
  };

  const handleGetInsName = (name) => {
    setInsNameId(name);
  };

  const handleGetGroupName = (name) => {
    setGroupNameId(name);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
  };

  const handleGetInsId = (id) => {
    setInsId(id);
    setGroupId('');
    navigate(`/payment?organization=${id}`);
  };

  const handleGetGroupId = (id) => {
    setGroupId(id);
    navigate(`/payment?organization=${insId}&educating_group=${id}`);
  };

  const showModalPayment = (user) => {
    setShowModal(true);
    setSelectedUser(user);
    setUserId(user.id);
  };

  const showModalUpdate = (user) => {
    setShowModal2(true);
    setSelectedUser(user);
    const userId = user.monthly_payments.reduce((total, payment) => parseFloat(payment.id), 0);
    setUserId2(userId);
    const firstPayment = parseInt(user.monthly_payments[0].amount);
    setGetFirstPayment(firstPayment);
  };

  const hideModalPayment = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const hideModalUpdate = () => {
    setShowModal2(false);
    setSelectedUser(null);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      hideModalUpdate();
      hideModalPayment();
      setOpenComment(false);
    }
  };

  const handleOpenComment = (comment) => {
    setAlertMessage(comment === '' ? 'Izoh kiritilmagan' : comment);
    setAlertType('info');
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  return (
    <div className='payment attendance'>
      {loading ? (<div className='loading'>
        <ThreeDots color="#222D32" />
      </div>) : error ? <p>{error}</p> : (<>
        {showAlert && (
          <Alert
            sx={{
              position: "display",
            }}
            variant="filled"
            severity={alertType}
          >
            <AlertTitle>
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            {alertMessage === "Request failed with status code 400" ? "Modalni to'ldiring" : alertMessage}
          </Alert>
        )}
        <div className="header">
          <div className="items">
            <div className="a-count">
              {(insNameId && payment) ? (
                <p>To'lov: {payment.count} dan {insNameId && payment.results ? payment.results.reduce((total, item) => total + item.monthly_payments.filter(payment => payment.is_completed).length, 0) : 0}</p>
              ) : (
                <p>To'lov: {payment.count} dan {insNameId && groupNameId && payment.results ? payment.results.reduce((total, item) => total + item.monthly_payments.filter(payment => payment.is_completed).length, 0) : 0}</p>
              )}

            </div>
            <InstitutionType handleGetInsName={handleGetInsName} handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
            <GroupNumber handleGetGroupName={handleGetGroupName} handleGetGroupId={handleGetGroupId} insId={insId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
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
                <th>To'lov</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <h3>Yuklanmoqda...</h3>
                  </td>
                </tr>
              ) : data && insNameId && groupNameId ? (
                data.map(item => (
                  <tr key={item.id}>
                    <td style={{ cursor: 'pointer' }} onClick={() => handleNameAbout(item.id)}>{item.first_name} {item.last_name}</td>
                    <td>{date}</td>
                    <td style={{ cursor: 'pointer' }} onClick={() => handleOpenComment(item.monthly_payments.reduce((total, payment) => (payment.comment), "To'lov qilinmagan"))}>
                      {item.monthly_payments.reduce((total, payment) => parseFloat(payment.amount), 0)}
                    </td>
                    <td>
                      {item.monthly_payments.reduce((total, payment) => (
                        payment.is_completed ?
                          <input type="checkbox" defaultChecked style={{ pointerEvents: 'none' }} />
                          :
                          <input type="checkbox" style={{ pointerEvents: 'none' }} />
                      ), "To'lanmagan")}
                    </td>
                    <td className='td-wrapper'>
                      {item.monthly_payments.length > 0 && (
                        <button className={item.monthly_payments.some(payment => payment.is_completed) ? 'edit-btn green-bg' : 'edit-btn'} onClick={() => showModalUpdate(item)}>
                          {item.monthly_payments.reduce((total, payment) => (
                            payment.is_completed ?
                              "To'landi"
                              :
                              "Yangilash"
                          ), "Yangilash")}
                        </button>
                      )}
                      {item.monthly_payments.length === 0 && (
                        <button className='payment-btn' onClick={() => showModalPayment(item)}>To'lov</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : <tr><td style={{ textAlign: 'center' }} colSpan={5}>Ma'lumot topilmadi</td></tr>}
              <tr>
                {insNameId && groupNameId && <td colSpan={5}>Ushbu oydagi umumiy summa: <b>{payment.total_payment}</b></td>}
              </tr>
            </tbody>
          </table>
          {data.length === 0 && <div style={{ marginTop: '150px' }} className='loading'><p>Ma'lumot topilmadi</p></div>}
        </div>
        {openComment && (
          <div onClick={handleModalClick} className='modal'>
            <div onClick={(e) => e.stopPropagation()} className="modal-content">
              <p>{openComment}</p>
            </div>
          </div>
        )}
        {showModal2 && (
          <div className="modal" onClick={handleModalClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p className='user-title'>{selectedUser && `${selectedUser.first_name} ${selectedUser.last_name}`}</p>
              <div className="amount">
                <div className="select-date">
                  <span>Sana: {year} yil {month} oy uchun</span>
                </div>
                <span>To'lov miqdorini kiriting</span>
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="comment">
                <span>Izoh</span>
                <textarea onChange={(e) => setComment(e.target.value)}></textarea>
              </div>
              <div className="paid-full">
                <input type="checkbox" checked={paidFull} onChange={(e) => setPaidFull(e.target.checked)} />
                <span>To'liq to'landi</span>
              </div>
              <button className='edit-btn' onClick={handleSubmit2}>Yangilash</button>
            </div>
          </div>
        )}
        {showModal && (
          <div className="modal" onClick={handleModalClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p className='user-title'>{selectedUser && `${selectedUser.first_name} ${selectedUser.last_name}`}</p>
              <div className="amount">
                <div className="select-date">
                  <span>Sana: {year} yil {month} oy uchun</span>
                </div>
                <span>To'lov miqdorini kiriting</span>
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="comment">
                <span>Izoh</span>
                <textarea onChange={(e) => setComment(e.target.value)}></textarea>
              </div>
              <div className="paid-full">
                <input type="checkbox" checked={paidFull} onChange={(e) => setPaidFull(e.target.checked)} />
                <span>To'liq to'landi</span>
              </div>
              <button onClick={handleSubmit}>Saqlash</button>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}

export default Payment;
