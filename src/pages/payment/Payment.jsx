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

  const queryParams = new URLSearchParams(location.search);

  const [data, setData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [insId, setInsId] = useState(queryParams.get('insId') || 1);
  const [groupId, setGroupId] = useState(queryParams.get('groupId') || 1);
  const [insNameId, setInsNameId] = useState(queryParams.get('insNameId') || '');
  const [groupNameId, setGroupNameId] = useState(queryParams.get('groupNameId') || '');
  const [date, setDate] = useState(getCurrentDate());
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
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `accounting/monthly-payments/list/?organization=${insId}&educating_group=${groupId}&type=student&year=${year}&month=${month}`, 
          {
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
            }
          }
        );
        setData(response.data.results);
        setPayment(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [insId, groupId, year, month]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('insId', insId);
    params.set('groupId', groupId);
    params.set('insNameId', insNameId);
    params.set('groupNameId', groupNameId);
    navigate({ search: params.toString() });
  }, [insId, groupId, insNameId, groupNameId, navigate]);

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
    console.log(requestData);

    axios.post('/accounting/monthly-payments/create/', requestData, {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
      }
    })
    .then(response => {
      console.log('Success:', response.data);
      setShowModal(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setShowModal(false);
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
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I'
      }
    })
    .then(response => {
      console.log('Updated:', response.data);
      setShowModal2(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setShowModal2(false);
    });
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String((today.getMonth() + 1).toString().padStart(2, '0'));
    return `${year}-${month}`;
  }

  const handleGetDate = (e) => {
    setDate(e.target.value);
    setYear(e.target.value.slice(0, 4));
    setMonth(e.target.value.slice(5));
  };

  const handleNameAbout = (id) => {
    navigate(`${id}`);
  };

  const handleGetInsName = (name) => {
    setInsNameId(name);
    console.log(name);
  };

  const handleGetGroupName = (name) => {
    setGroupNameId(name);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
  };

  const handleGetInsId = (id) => {
    setInsId(id);
  };

  const handleGetGroupId = (id) => {
    setGroupId(id);
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
    alert(comment === '' ? 'Izoh kiritilmagan' : comment);
  };

  return (
    <div className='payment attendance'>
      <div className="header">
        <div className="a-count">
          <p>To'lov: {groupNameId && insNameId && payment && payment.count} dan {payment && payment.results ? payment.results.reduce((total, item) => total + item.monthly_payments.length, 0) : 0}</p>
        </div>
        <div className="items">
          <InstitutionType handleGetInsName={handleGetInsName} handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} />
          <GroupNumber handleGetGroupName={handleGetGroupName} handleGetGroupId={handleGetGroupId} insId={insId} toggleDropdown={toggleDropdown} activeDropdown={activeDropdown} />
          <div className="select-date">
            <input defaultValue={getCurrentDate()} type='month' onChange={handleGetDate} />
          </div>
        </div>
      </div>
      <div className="body">
        <div className="selected-item-title">
          <span>Muassasa turi: {insNameId}</span>
          <span>Guruh sinf raqami: {groupNameId}</span>
          <span>Sana: {date}</span>
        </div>
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
            {data && insNameId && groupNameId ? (
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
                        <input type="checkbox" checked style={{ pointerEvents: 'none' }} />
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
    </div>
  );
}

export default Payment;
