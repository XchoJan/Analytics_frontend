import React from 'react';
import {Prediction} from '../types';
import './ResultCard.css';

interface Props {
  prediction: Prediction;
}

export const ResultCard: React.FC<Props> = ({prediction}) => {
  if (prediction.type === 'single') {
    return (
      <div className="result-card">
        <h3 className="match">{prediction.match}</h3>
        <p className="prediction">{prediction.prediction}</p>
        <div className="stats-row">
          <div className="stat">
            <span className="label">Коэффициент</span>
            <span className="value">{prediction.odds.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="label">Риск</span>
            <span className="value">{prediction.confidence}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="result-card">
      <h3 className="title">Экспресс x3</h3>
      <div className="bets-list">
        {prediction.bets.map((bet, idx) => (
          <div key={idx} className="bet-item">
            <h4 className="match">{bet.match}</h4>
            <p className="prediction">{bet.prediction}</p>
            <p className="odds">Коэффициент: {bet.odds.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="footer">
        <p className="total-odds">
          Общий коэффициент: {prediction.total_odds.toFixed(2)}
        </p>
        <p className="confidence">Уверенность: {prediction.confidence}%</p>
      </div>
    </div>
  );
};

