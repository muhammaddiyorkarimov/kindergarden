import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../../service/Api';
import { ThreeDots } from 'react-loader-spinner';
import { Alert, AlertTitle } from "@mui/material";
import InstitutionType from '../../components/InstitutionType';
import PaymentModal from './../../components/PaymentModal';
import UpdatePaymentModal from './../../components/UpdatePaymentModal';
import UserImage from '../../ui/UserImage';
import SearchInputs from '../../components/SerachInputs';

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
  const [loading, setLoading] = useState(false);
  const [insNameId, setInsNameId] = useState('');
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [timeoutExpired, setTimeoutExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateWorkCalendarSuccess = (newWorkCalendar) => {
    navigate('/work-calendar', { state: { newWorkCalendar } });
  };

  useEffect(() => {
    if (!urlYear || !urlMonth) {
      navigate(`/salary?organization=${insId}&year=${year}&month=${month}`);
    }
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const token = Cookies.get('access_token');
      const timeout = setTimeout(() => {
        setTimeoutExpired(true);
        setLoading(false);
      }, 4000);
      try {
        setLoading(true)
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
      fetchAttendanceData();
    } else {
      fetchAttendanceData();
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
    navigate(`/salary?organization=${id}&year=${year}&month=${month}`);
  };

  const handleOpenComment = (comment) => {
    alert(comment === '' ? 'Izoh kiritilmagan' : comment);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const hideModalPayment = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const hideModalUpdate = () => {
    setShowModal2(false);
    setSelectedUser(null);
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

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const normalizeString = (str) => {
    return str.toLowerCase().replace(/x/g, 'h');
  };

  const filteredData = data.filter(item =>
    normalizeString(`${item.first_name} ${item.last_name} ${item.middle_name}`).includes(normalizeString(searchTerm))
  );

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
            <SearchInputs handleSearch={handleSearch} />
            <div className="items">
              <div className="a-count">
                <p>To'lov: {data.length} dan {payment && payment.total_payments_number}</p>
                {/* <p>To'lov: {data.length} dan {data ? data.reduce((total, item) => total + item.monthly_payments.filter(payment => payment.is_completed).length, 0) : 0}</p> */}
              </div>
              <InstitutionType handleGetInsName={handleGetInsName} handleGetInsId={handleGetInsId} activeDropdown={activeDropdown} toggleDropdown={toggleDropdown} type="worker"
                date={date} />
              <div className="select-date">
                <input value={`${year}-${month}`} type='month' onChange={handleGetDate} />
              </div>
              <div className="a-count2">
                {data.length > 0 && <p colSpan={9}>Umumiy summa: <b>{formatNumberWithCommas(data.reduce((total, item) => total + item.monthly_payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0), 0))}</b></p>}
              </div>
            </div>
          </div>
          <div className="body">
            <table>
              <thead>
                <tr>
                  <th>Rasm</th>
                  <th>Ism</th>
                  <th>To'langan Summa (izoh)</th>
                  <th>To'liq to'landimi</th>
                  <th>Jami ishga kelgan kunlar</th>
                  <th>Ishlagan soati</th>
                  <th>1 oylik jami ish kunlar</th>
                  <th>Jami hisoblangan oylik</th>
                  <th>To'liq ish haqi</th>
                  <th>To'lov</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length == 0 ? (
                  <tr>
                    <td style={{ textAlign: 'center' }} colSpan={9}>
                      Ma'lumot topilmadi
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map(item => (
                    <tr key={item.id}>
                      <td>
                        <span>Rasm:</span>
                        <div className="user-image-wrapper">
                          <UserImage src={item.face_image} />
                        </div>
                      </td>
                      <td style={{ cursor: 'pointer' }} onClick={() => handleNameAbout(item.id)}>
                        <span>Ism:</span>
                        {item.first_name} {item.last_name}</td>
                      <td style={{ cursor: 'pointer' }} onClick={() => handleOpenComment(item.monthly_payments ? item.monthly_payments.reduce((total, payment) => payment.comment, "To'lov qilinmagan") : "To'lov qilinmagan")}>
                        <span>To'langan summa:</span>{formatNumberWithCommas(item.monthly_payments ? item.monthly_payments.reduce((total, payment) => total + parseFloat(payment.amount), 0) : 0)}
                      </td>
                      <td>
                        <span>To'liq to'landimi</span>
                        {item.monthly_payments ? item.monthly_payments.reduce((total, payment) => (
                          payment.is_completed ?
                            <input type="checkbox" defaultChecked style={{ pointerEvents: 'none' }} /> :
                            <input type="checkbox" style={{ pointerEvents: 'none' }} />
                        ), <input type="checkbox" style={{ pointerEvents: 'none' }} />) : <input type="checkbox" style={{ pointerEvents: 'none' }} />}
                      </td>
                      <td><span>Jami ishga kelgan kunlar:</span>{item.present_days !== null ? item.present_days : "0"}</td>
                      <td><span>Ishlagan soati:</span>{item.worked_hours !== null ? item.worked_hours : "0"}</td>
                      <td><span>1 oylik jami ish kunlar:</span>{item.total_working_days !== null ? item.total_working_days : "0"}</td>
                      <td><span>Jami hisoblangan oylik:</span>{item.calculated_salary !== null ? item.calculated_salary : "0"}</td>
                      <td><span>To'liq ish haqi:</span> {item.full_salary !== null ? item.full_salary : "0"}</td>
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
                    <td style={{ textAlign: 'center' }} colSpan={9}>
                      Ma'lumot yo'q
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )
      }
      {showModal && <PaymentModal isCompleted={isCompleted} showAlert={showAlertMessage} hideModal={hideModalPayment} userId={selectedUser.id} selectedUser={selectedUser} insId={insId} year={year} month={month} />}
      {showModal2 && <UpdatePaymentModal isCompleted={isCompleted} showAlert={showAlertMessage} hideModal={hideModalUpdate} userId={selectedUser.id} selectedUser={selectedUser} insId={insId} year={year} month={month} />}
    </div >
  );
}

export default Salary;
