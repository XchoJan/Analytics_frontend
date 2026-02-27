import React, { useState, useEffect } from 'react';
import { generatePredictions, getPredictionCounts } from '../services/admin';
import './AdminMenu.css';

interface Props {
  currentView: 'main' | 'urls' | 'users';
  onViewChange: (view: 'main' | 'urls' | 'users') => void;
}

export const AdminMenu: React.FC<Props> = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [counts, setCounts] = useState<{ single: number; express: number; express5: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      getPredictionCounts().then(setCounts).catch(() => setCounts(null));
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generatePredictions();
      alert('Генерация запущена. Прогнозы появятся через 2–3 минуты.');
    } catch (e: any) {
      alert(e.response?.data?.message || 'Ошибка');
    } finally {
      setGenerating(false);
      setIsOpen(false);
    }
  };

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
          {counts && (
            <div className="admin-menu-status">
              Прогнозы: single {counts.single} · express {counts.express} · express5 {counts.express5}
            </div>
          )}
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
          <button
            className="admin-menu-item"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'Запуск...' : 'Сгенерировать прогнозы'}
          </button>
        </div>
      )}
    </div>
  );
};

