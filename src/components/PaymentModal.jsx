import React, { useState } from 'react';
import axios from '../service/Api';
import Cookies from 'js-cookie';

const PaymentModal = ({ selectedUser, hideModal, year, month, showAlert }) => {
  const [amount, setAmount] = useState('');
  const [paidFull, setPaidFull] = useState(false);
  const [comment, setComment] = useState('');

  const token = Cookies.get('access_token');

  const handleSubmit = async () => {
    const requestData = {
      user: selectedUser.id,
      type: 'tuition_fee',
      amount: parseFloat(amount), 
      month: parseInt(month, 10),
      year: parseInt(year, 10),
      is_completed: paidFull,
      comment: comment,
    };

    console.log(requestData);

    try {
      const response = await axios.post('/accounting/monthly-payments/create/', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showAlert('success', 'Muvaffaqiyatli qo\'shildi');
      hideModal();
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      console.error('Error response:', error.response?.data);
      showAlert('error', errorMessage);
      hideModal();
    }
  };

  return (
    <div className="modal" onClick={hideModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p className='user-title'>{selectedUser && `${selectedUser.first_name} ${selectedUser.last_name}`}</p>
        <div className="amount">
          <div className="select-date">
            <span>Sana: {year} yil {month} uchun</span>
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
  );
};

export default PaymentModal;
