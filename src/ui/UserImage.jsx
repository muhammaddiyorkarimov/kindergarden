import React, { useState } from 'react';
import './UserImage.css'; 

function UserImage({ src }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openFullImage = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <img onClick={openFullImage} src={src} alt="Image" style={{ cursor: 'pointer' }} />
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={src} alt="Image" />
            <button className="close-button" onClick={closeModal}>×</button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserImage;
