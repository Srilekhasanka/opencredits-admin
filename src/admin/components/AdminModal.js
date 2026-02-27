import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const AdminModal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="admin-modal__overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{title}</h2>
          <button
            className="admin-modal__close"
            type="button"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  );
};

export default AdminModal;
