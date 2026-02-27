import React from 'react';
import { MatchAnalysis } from '../services/api';
import './MatchAnalysisCard.css';

interface Props {
  analysis: MatchAnalysis;
}

export const MatchAnalysisCard: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="match-analysis-card">
      <div className="match-analysis-card-header">
        <h3>Прогноз на матч</h3>
      </div>
      <div className="match-analysis-card-content">
        <div className="match-analysis-card-item">
          <span className="match-analysis-card-label">Игра:</span>
          <span className="match-analysis-card-value">{analysis.match}</span>
        </div>
        <div className="match-analysis-card-item">
          <span className="match-analysis-card-label">Прогноз:</span>
          <span className="match-analysis-card-value">{analysis.prediction}</span>
        </div>
        <div className="match-analysis-card-item">
          <span className="match-analysis-card-label">Коэффициент:</span>
          <span className="match-analysis-card-value match-analysis-card-odds">
            {analysis.odds.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

