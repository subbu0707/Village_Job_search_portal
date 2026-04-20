import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Modal.css';

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {t(cancelText)}
          </button>
          {onConfirm && (
            <button className="btn-primary" onClick={onConfirm}>
              {t(confirmText)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
