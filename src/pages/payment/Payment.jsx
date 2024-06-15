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
import UserImage from '../../ui/UserImage';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const urlInsId = query.get('organization') || '';
  const urlGroupId = query.get('educating_group') || '';
  const urlDate = query.get('date') || getCurrentDate();

  const [insId, setInsId] = useState(urlInsId);
  const [groupId, setGroupId] = useState(urlGroupId);
  const [insNameId, setInsNameId] = useState('');
  const [groupNameId, setGroupNameId] = useState('');
  const [data, setData] = useState([]);
  const [date, setDate] = useState(urlDate);
  const [year, setYear] = useState(date.slice(0, 4));
  const [month, setMonth] = useState(date.slice(5));
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [activeDropdown, setActiveDropdown] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentNumber, setPaymentNumber] = useState(null);

  useEffect(() => {
    if (!query.get('date')) {
      navigate(`?${insId ? `organization=${insId}&` : ''}${groupId ? `educating_group=${groupId}&` : ''}date=${date}`);
    }
  }, []);

  const token = Cookies.get('access_token');

  useEffect(() => {
    const fetchAttendanceData = async (url) => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        setPaymentNumber(response.data);
        setData(response.data.results);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    if (insId || groupId) {
      const url = groupId
        ? `accounting/monthly-payments/list/?${insId ? `organization=${insId}&` : ''}educating_group=${groupId}&type=student&year=${year}&month=${month}`
        : `accounting/monthly-payments/list/?${insId ? `organization=${insId}&` : ''}&type=student&year=${year}&month=${month}`
      fetchAttendanceData(url);
    } else {
      const url = `accounting/monthly-payments/list/?type=student&year=${year}&month=${month}`
      fetchAttendanceData(url);
    }
  }, [insId, groupId, year, month, token]);

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

    navigate(`?${insId ? `organization=${insId}&` : ''}${groupId ? `educating_group=${groupId}&` : ''}date=${newDate}`);
  };

  const handleNameAbout = (id) => {
    navigate(`${id}`);
    const selectedUser = data.find(user => user.id === id);
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
    setIsCompleted(user.monthly_payments.some(payment => payment.is_completed));
  };

  const showModalUpdate = (user) => {
    setShowModal2(true);
    setSelectedUser(user);
    setIsCompleted(user.monthly_payments.some(payment => payment.is_completed));
  };

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


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
                <p>To'lov: {data.length} dan {paymentNumber && paymentNumber.total_payments_number}</p>
                {/* <p>To'lov: {data.length} dan {data ? data.reduce((total, item) => total + item.monthly_payments.filter(payment => payment.is_completed).length, 0) : 0}</p> */}
              </div>
              <InstitutionType handleGetInsName={handleGetInsName} handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} type="student"
                date={date} />
              <GroupNumber handleGetGroupName={handleGetGroupName} handleGetGroupId={handleGetGroupId} insId={insId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} type="student"
                date={date} />
              <div className="select-date">
                <input defaultValue={getCurrentDate()} type='month' onChange={handleGetDate} />
              </div>
              <div className="a-count2">
                {data.length > 0 && <td colSpan={7}>Umumiy summa: <b>{formatNumberWithCommas(data.reduce((total, item) => total + item.monthly_payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0), 0))}</b></td>}
              </div>
            </div>
          </div>
          <div className="body">
            <table>
              <thead>
                <tr>
                  <th>Rasm</th>
                  <th>Ism</th>
                  <th>Sana</th>
                  <th>Jami kelgan kunlar</th>
                  <th>To'langan Summa</th>
                  <th>To'liq to'landimi</th>
                  <th>To'lov</th>
                </tr>
              </thead>
              <tbody>
                {data.length == 0 ? (
                  <tr>
                    <td style={{ textAlign: 'center' }} colSpan={5}>
                      Ma'lumot topilmadi
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map(item => (
                    <tr key={item.id}>
                      <td>
                        <span>Rasm: </span>
                        <div className="user-image-wrapper">
                          <UserImage src={item.face_image} />
                        </div>
                      </td>
                      <td style={{ cursor: 'pointer' }} onClick={() => handleNameAbout(item.id)}><span>Ism:</span>{item.first_name} {item.last_name}</td>
                      <td><span>Sana:</span>{date}</td>
                      <td><span>Jami kelgan kunlar:</span>{item.present_days}</td>
                      <td style={{ cursor: 'pointer' }}>
                        <span>To'langan summa:</span>
                        {formatNumberWithCommas(item.monthly_payments.reduce((total, payment) => total + parseFloat(payment.amount), 0))}
                      </td>
                      <td>
                        <span>To'liq to'landimi:</span>
                        {item.monthly_payments.reduce((total, payment) => {
                          return (
                            payment.is_completed ?
                              <input type="checkbox" defaultChecked style={{ pointerEvents: 'none' }} />
                              :
                              <input type="checkbox" style={{ pointerEvents: 'none' }} />
                          )
                        }, <input type="checkbox" style={{ pointerEvents: 'none' }} />)}
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
              </tbody>
            </table>
          </div>
          {showModal && (
            <PaymentModal
              selectedUser={selectedUser}
              hideModal={hideModalPayment}
              year={year}
              month={month}
              showAlert={showAlertMessage}
              isCompleted={isCompleted}
            />
          )}
          {showModal2 && (
            <UpdatePaymentModal
              selectedUser={selectedUser}
              hideModal={hideModalUpdate}
              year={year}
              month={month}
              showAlert={showAlertMessage}
              isCompleted={isCompleted}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Payment;
