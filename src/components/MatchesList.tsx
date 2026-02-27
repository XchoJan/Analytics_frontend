import React from 'react';
import { Match } from '../services/api';
import './MatchesList.css';

interface MatchesListProps {
  matches: Match[];
}

export const MatchesList: React.FC<MatchesListProps> = ({ matches }) => {

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const matchDate = new Date(date);
    matchDate.setHours(0, 0, 0, 0);
    
    if (matchDate.getTime() === today.getTime()) {
      return 'Сегодня';
    } else if (matchDate.getTime() === tomorrow.getTime()) {
      return 'Завтра';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long',
        weekday: 'short'
      });
    }
  };


  if (matches.length === 0) {
    return (
      <div className="matches-list-empty">
        <p>Матчи не найдены</p>
      </div>
    );
  }

  return (
    <div className="matches-list">
      <h2 className="matches-list-title">Ближайшие матчи</h2>
      <div className="matches-grid">
        {matches.map((match, index) => {
          const cardId = `match-card-${index}`;

          return (
            <div 
              key={cardId} 
              id={cardId}
              className="match-card"
            >
              <div className="match-card-content">
                <div className="match-date">
                  <span className="match-date-text">{formatDate(match.date)}</span>
                  {match.time && (
                    <span className="match-time">{match.time}</span>
                  )}
                </div>
                <div className="match-teams">
                  <div className="match-team match-team-home">
                    {match.homeTeam}
                  </div>
                  <div className="match-vs">vs</div>
                  <div className="match-team match-team-away">
                    {match.awayTeam}
                  </div>
                </div>

                {match.odds && (
                  <div className="match-odds">
                    <div className="match-odds-title">Коэффициенты:</div>
                    <div className="match-odds-container">
                      <div className="match-odd-item">
                        <span className="match-odd-label">П1</span>
                        <span className="match-odd-value">{match.odds.home.toFixed(2)}</span>
                      </div>
                      <div className="match-odd-item">
                        <span className="match-odd-label">X</span>
                        <span className="match-odd-value">{match.odds.draw.toFixed(2)}</span>
                      </div>
                      <div className="match-odd-item">
                        <span className="match-odd-label">П2</span>
                        <span className="match-odd-value">{match.odds.away.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

