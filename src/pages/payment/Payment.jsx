import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../../service/Api';
import { ThreeDots } from 'react-loader-spinner';
import { Alert, AlertTitle } from "@mui/material";
import GroupNumber from '../../components/GroupNumber';
import InstitutionType from '../../components/InstitutionType';
import './Payment.css';
import PaymentModal from './../../components/PaymentModal';
import UpdatePaymentModal from './../../components/UpdatePaymentModal';

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
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [activeDropdown, setActiveDropdown] = useState('');

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
        setLoading(false);
        localStorage.setItem('data', JSON.stringify(response.data.results));
      } catch (error) {
        console.error('Error fetching data:', error.message);
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

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };


  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  const hideModalPayment = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const hideModalUpdate = () => {
    setShowModal2(false);
    setSelectedUser(null);
  };

  const handleGetDate = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setYear(newDate.slice(0, 4));
    setMonth(newDate.slice(5));
  };

  const handleNameAbout = (id) => {
    navigate(`${id}`);
    const selectedUser = data.find(user => user.id === id);
    // navigate(`/payment-user/${id}`, { state: { selectedUser } });
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
  };

  const showModalUpdate = (user) => {
    setShowModal2(true);
    setSelectedUser(user);
  };

  return (
    <div className='payment attendance'>
      {loading ? (
        <div className='loading'>
          <ThreeDots color="#222D32" />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {showAlert && (
            <Alert
              sx={{ position: "fixed" }}
              variant="filled"
              severity={alertType}
              className='mui-alert'
            >
              <AlertTitle>
                {alertType === "success" ? "Success" : "Error"}
              </AlertTitle>
              {alertMessage}
            </Alert>
          )}
          <div className="header">
            <div className="items">
              <div className="a-count">
                {(insNameId && data) ? (
                  <p>To'lov: {data.length} dan {insNameId && data ? data.reduce((total, item) => total + item.monthly_payments.filter(payment => payment.is_completed).length, 0) : 0}</p>
                ) : (
                  <p>To'lov: {data.length} dan {insNameId && groupNameId && data ? data.reduce((total, item) => total + item.monthly_payments.filter(payment => payment.is_completed).length, 0) : 0}</p>
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
                      <td style={{ cursor: 'pointer' }} onClick={() => showAlertMessage('eslatma', item.monthly_payments.reduce((total, payment) => (payment.comment), "To'lov qilinmagan"))}>
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
                ) : (
                  <tr>
                    <td style={{ textAlign: 'center' }} colSpan={5}>Ma'lumot topilmadi</td>
                  </tr>
                )}
                <tr>
                  {insNameId && groupNameId && <td colSpan={5}>Ushbu oydagi umumiy summa: <b>{data.reduce((total, item) => total + item.monthly_payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0), 0)}</b></td>}
                </tr>
              </tbody>
            </table>
            {data.length === 0 && <div style={{ marginTop: '150px' }} className='loading'><p>Ma'lumot topilmadi</p></div>}
          </div>
          {showModal && (
            <PaymentModal
              selectedUser={selectedUser}
              hideModal={hideModalPayment}
              year={year}
              month={month}
              showAlert={showAlertMessage}
            />
          )}
          {showModal2 && (
            <UpdatePaymentModal
              selectedUser={selectedUser}
              hideModal={hideModalUpdate}
              year={year}
              month={month}
              showAlert={showAlertMessage}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Payment;
