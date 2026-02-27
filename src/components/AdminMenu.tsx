import React, { useState } from 'react';
import './AdminMenu.css';

interface Props {
  currentView: 'main' | 'urls' | 'users';
  onViewChange: (view: 'main' | 'urls' | 'users') => void;
}

export const AdminMenu: React.FC<Props> = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="admin-menu-container">
      <button 
        className="admin-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰ Меню
      </button>
      
      {isOpen && (
        <div className="admin-menu-dropdown">
          <button
            className={`admin-menu-item ${currentView === 'urls' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('urls');
              setIsOpen(false);
            }}
          >
            Ссылки
          </button>
          <button
            className={`admin-menu-item ${currentView === 'users' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('users');
              setIsOpen(false);
            }}
          >
            Пользователи
          </button>
          <button
            className={`admin-menu-item ${currentView === 'main' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('main');
              setIsOpen(false);
            }}
          >
            Главная
          </button>
        </div>
      )}
    </div>
  );
};

