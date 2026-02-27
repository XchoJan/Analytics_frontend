import React from 'react';
import { MatchAnalysis } from '../services/api';
import './ExpressAnalysisCard.css';

interface ExpressBet {
  match: string;
  prediction: string;
  riskPercent: number;
}

interface Props {
  bets: ExpressBet[];
  totalRisk: number;
  type?: 'express' | 'express5';
}

export const ExpressAnalysisCard: React.FC<Props> = ({ bets, totalRisk, type = 'express' }) => {
  return (
    <div className="express-analysis-card">
      <div className="express-analysis-card-header">
        <h3>Экспресс {type === 'express5' ? 'x5' : 'x3'}</h3>
      </div>
      <div className="express-analysis-card-bets">
        {bets.map((bet, idx) => (
          <div key={idx} className="express-analysis-bet-item">
            <div className="express-analysis-bet-match">
              <span className="express-analysis-bet-label">Игра {idx + 1}:</span>
              <span className="express-analysis-bet-value">{bet.match}</span>
            </div>
            <div className="express-analysis-bet-prediction">
              <span className="express-analysis-bet-label">Прогноз:</span>
              <span className="express-analysis-bet-value">{bet.prediction}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

