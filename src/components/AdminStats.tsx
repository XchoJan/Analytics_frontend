import React, { useState, useEffect } from 'react';
import { getAdminStats, AdminStatsData } from '../services/admin';
import './AdminStats.css';

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setError('Не удалось загрузить статистику'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-stats">
        <p className="admin-stats-loading">Загрузка...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="admin-stats">
        <p className="admin-stats-error">{error || 'Нет данных'}</p>
      </div>
    );
  }

  const items = [
    { label: 'Всего пользователей', value: stats.totalUsers },
    { label: 'Premium (активные подписки)', value: stats.premiumCount },
    { label: 'Запусков приложения', value: stats.totalLaunches },
    { label: 'Оплаченных подписок (всего)', value: stats.successfulPayments },
    { label: 'Новых пользователей за 7 дней', value: stats.newUsersLast7Days },
    { label: 'Новых оплат за 7 дней', value: stats.newPaymentsLast7Days },
  ];

  return (
    <div className="admin-stats">
      <h2 className="admin-stats-title">Статистика</h2>
      <div className="admin-stats-grid">
        {items.map(({ label, value }) => (
          <div key={label} className="admin-stats-card">
            <div className="admin-stats-value">{value}</div>
            <div className="admin-stats-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
