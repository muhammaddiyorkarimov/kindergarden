import { useEffect, useState } from 'react'
import axios from '../../service/Api'
import { useParams } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import Cookies from 'js-cookie';
import './Payment.css'
import UserImage from '../../ui/UserImage';

function PaymentUser() {

  const [data, setData] = useState([]);
  const [date, setDate] = useState(getCurrentYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(`accounting/monthly-payments/${id}/yearly/?year=${date}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data:' + error.message);
        setLoading(false);
      }
    }

    fetchData();
  }, [date]);

  // getCurrentYear
  function getCurrentYear() {
    const today = new Date();
    const year = today.getFullYear();
    return `${year}`;
  }

  // handle get date
  const handleGetDate = (e) => {
    const selectedDate = new Date(e.target.value);
    const year = selectedDate.getFullYear();
    setDate(selectedDate == 'Invalid Date' ? 2000 : year);
  };

  // getMonthName
  function getMonthName(date) {
    const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
      "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

    const monthIndex = date.getMonth();
    return monthNames[monthIndex];
  }

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className='attendance payment-user'>
      {loading ? <div className='loading'>
        <ThreeDots color="#222D32" />
      </div> : error ? <p>{error}</p> : <>
        <div className="header">
          <div className="select-date">
            <span>Yilni kiriting: </span>
            <input defaultValue={getCurrentYear()} type='number' onChange={handleGetDate} />
          </div>
        </div>
        <div className="body">
          {data && data.monthly_payments && <table>
            <thead>
            <tr>
								<th colSpan={5}>
									<div className="user-image-wrapper">
									<UserImage src={data.face_image} />
								</div>
								 {data.first_name} {data.last_name} {data.middle_name}</th>
							</tr>
            </thead>
            <tbody>
              {data && data.monthly_payments && data.monthly_payments.length > 0 ? (
                data.monthly_payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{getMonthName(new Date(payment.paid_month))}</td>
                    <td>{payment.paid_month}</td>
                    <td>Izoh: {payment.comment.length < 1 ? 'Izoh kiritilmagan' : payment.comment}</td>
                    <td>{formatNumberWithCommas(payment.amount)}</td>
                    <td>
                      <input type="checkbox" defaultChecked={payment.is_completed} style={{ pointerEvents: 'none' }} />
                    </td>
                  </tr>
                ))
              ) : <tr><td className='user-payment-empty'>Hali to'lov qilmagan</td></tr>}
            </tbody>
          </table>}
          {data.length === 0 && <div className='loading'><ThreeDots color='#222D32' /></div>}
        </div>
      </>}
    </div>
  )
}

export default PaymentUser;
