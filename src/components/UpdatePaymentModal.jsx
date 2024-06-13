import React, { useState, useEffect } from 'react';
import axios from '../service/Api';
import Cookies from 'js-cookie';
import { Alert, AlertTitle } from '@mui/material';

const UpdatePaymentModal = ({ selectedUser, hideModal, year, month, showAlert,  isCompleted }) => {
  const [amount, setAmount] = useState('');
  const [paidFull, setPaidFull] = useState(false);
  const [comment, setComment] = useState('');
  const [getFirstPayment, setGetFirstPayment] = useState(0);
  const [userId2, setUserId2] = useState(1);


  const token = Cookies.get('access_token');

  useEffect(() => {
    if (selectedUser) {
      const userId = selectedUser.monthly_payments.reduce((total, payment) => parseFloat(payment.id), 0);
      setUserId2(userId);
      const firstPayment = parseInt(selectedUser.monthly_payments[0].amount);
      setGetFirstPayment(firstPayment);
    }
  }, [selectedUser]);

  const handleSubmit2 = () => {
    const updatedData = {
      user: userId2,
      amount: parseFloat(amount),
      is_completed: paidFull,
      comment: comment,
    };

    axios.patch(`/accounting/monthly-payments/${userId2}/update/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      showAlert('success', 'Muvaffaqiyatli yangilandi');
      hideModal();
      setTimeout(() => window.location.reload(), 2000);
    })
    .catch(error => {
      showAlert('error', error.message);
      hideModal();
    });
  };

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="modal" onClick={hideModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p className='user-title'>{selectedUser && `${selectedUser.first_name} ${selectedUser.last_name}`}</p>
        <div className="amount">
          <div className="select-date">
            <span>Sana: {year} yil {month} uchun</span>
          </div>
          <span>To'lov miqdorini kiriting</span>
          <input type="number" placeholder={isCompleted ? `To'langan summa ${formatNumberWithCommas(getFirstPayment)}` : `Avvalgi summa ${formatNumberWithCommas(getFirstPayment)}`} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="comment">
          <span>Izoh</span>
          <textarea onChange={(e) => setComment(e.target.value)}></textarea>
        </div>
        <div className="paid-full">
          {isCompleted ? <input type="checkbox" checked={true} onChange={(e) => setPaidFull(e.target.checked)} /> : 
          <input type="checkbox" checked={paidFull} onChange={(e) => setPaidFull(e.target.checked)} />
          }
          <span>To'liq to'landi</span>
        </div>
        <button className='edit-btn' onClick={handleSubmit2}>Yangilash</button>
      </div>
    </div>
  );
};

export default UpdatePaymentModal;
