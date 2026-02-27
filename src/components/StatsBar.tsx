import React from 'react';
import './StatsBar.css';

interface StatsBarProps {
  activeUsers: number;
  successfulPredictions: number;
  failedPredictions: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  activeUsers,
  successfulPredictions,
  failedPredictions,
}) => {
  return (
    <div className="stats-bar">
      <div className="stats-item">
        <span className="stats-label">Активных пользователей</span>
        <span className="stats-value">{activeUsers}</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">Удачных прогнозов</span>
        <span className="stats-value stats-value-success">{successfulPredictions}</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">Проигранных прогнозов</span>
        <span className="stats-value stats-value-failed">{failedPredictions}</span>
      </div>
    </div>
  );
};

