import React from 'react';
import './SubscriptionModal.css';

interface Props {
  onClose: () => void;
  onSelectPlan: (plan: 'week' | 'month' | 'threeMonths') => void;
}

export const SubscriptionModal: React.FC<Props> = ({ onClose, onSelectPlan }) => {
  const plans = [
    { id: 'week' as const, name: 'Неделя', price: 15, duration: '7 дней' },
    { id: 'month' as const, name: 'Месяц', price: 50, duration: '30 дней' },
    { id: 'threeMonths' as const, name: '3 месяца', price: 120, duration: '90 дней' },
  ];

  return (
    <div className="subscription-modal-overlay" onClick={onClose}>
      <div className="subscription-modal" onClick={(e) => e.stopPropagation()}>
        <button className="subscription-modal-close" onClick={onClose}>×</button>
        <h2 className="subscription-modal-title">Оформите подписку</h2>
        <p className="subscription-modal-description">
          Получите неограниченный доступ ко всем прогнозам
        </p>
        <div className="subscription-plans">
          {plans.map((plan) => (
            <div key={plan.id} className="subscription-plan">
              <div className="subscription-plan-header">
                <h3 className="subscription-plan-name">{plan.name}</h3>
                <div className="subscription-plan-price">
                  <span className="subscription-plan-amount">${plan.price}</span>
                </div>
              </div>
              <p className="subscription-plan-duration">{plan.duration}</p>
              <button
                className="subscription-plan-button"
                style={{position: 'relative'}}
                onClick={() => onSelectPlan(plan.id)}
              >
                <span style={{ marginRight: 8, position: 'absolute', 
                  right: 10, bottom: 4 }}>
                  Выбрать

                </span>
              </button>
            </div>
          ))}
        </div>
        <p className="subscription-modal-note">
          * Оплата производится безопасным способом
        </p>
      </div>
    </div>
  );
};

