import React, { useState } from 'react';
import './UserImage.css'

function DetailModal({ isOpen, onClose, user }) {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        {user ? (
          <div className="user-details">
            <img src={user.face_image} alt={`${user.first_name} ${user.last_name}`} />
            <p><strong>F.I.O:</strong> {user.first_name} {user.last_name} {user.middle_name || ''}</p>
            <p><strong>Jami ishga kelgan kunlar:</strong> {user.present_days !== null ? user.present_days : "Ma'lumot topilmadi"}</p>
            <p><strong>Ishlagan soati:</strong> {user.worked_hours !== null ? user.worked_hours : "Ma'lumot topilmadi"}</p>
            <p><strong>Jami ish soati:</strong> {user.total_working_hours !== null ? user.total_working_hours : "Ma'lumot topilmadi"}</p>
            <p><strong>Jami hisoblangan oylik:</strong> {user.calculated_salary !== null ? user.calculated_salary : "Ma'lumot topilmadi"}</p>
          </div>
        ) : (
          <p>Ma'lumot topilmadi</p>
        )}
      </div>
    </div>
  );
}

export default DetailModal;
