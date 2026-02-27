import React, {useState, useEffect} from 'react';
import {getSinglePrediction, getExpressPrediction, getExpress5Prediction, getMatchesWithOdds, Match, MatchAnalysis, getStats, Stats, createPayment} from './services/api';
import {Prediction} from './types';
import {ResultCard} from './components/ResultCard';
import {LoadingSpinner} from './components/LoadingSpinner';
import {ErrorMessage} from './components/ErrorMessage';
import {MatchesList} from './components/MatchesList';
import {MatchAnalysisCard} from './components/MatchAnalysisCard';
import {ExpressAnalysisCard} from './components/ExpressAnalysisCard';
import {StatsBar} from './components/StatsBar';
import {Login} from './components/Login';
import {Register} from './components/Register';
import {SubscriptionModal} from './components/SubscriptionModal';
import {AdminMenu} from './components/AdminMenu';
import {UrlManagement} from './components/UrlManagement';
import {getCurrentUser, getToken, logout, User} from './services/auth';
import './App.css';

interface ExpressBet {
  match: string;
  prediction: string;
  riskPercent: number;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null);
  const [expressAnalysis, setExpressAnalysis] = useState<{ bets: ExpressBet[]; totalRisk: number } | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [adminView, setAdminView] = useState<'main' | 'urls' | 'users'>('main');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadMatches();
      loadStats();
    }
  }, [user]);

  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      // Токен недействителен, удаляем его
      logout();
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSuccess = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      // Очищаем состояние прогнозов при входе нового пользователя
      setPrediction(null);
      setMatchAnalysis(null);
      setExpressAnalysis(null);
      setError(null);
    } catch (err) {
      console.error('Error getting user:', err);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    // Очищаем все состояние прогнозов при выходе
    setPrediction(null);
    setMatchAnalysis(null);
    setExpressAnalysis(null);
    setMatches([]);
    setError(null);
    setStats(null);
  };

  const loadStats = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadMatches = async () => {
    setMatchesLoading(true);
    setError(null);
    try {
      // Загружаем матчи только из totogaming
      const matchesData = await getMatchesWithOdds();
      if (matchesData && matchesData.length > 0) {
        setMatches(matchesData);
      } else {
        setError('Матчи не найдены');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Ошибка при загрузке матчей из totogaming',
      );
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleSingle = async () => {
    setLoading(true);
    setError(null);
    setMatchAnalysis(null);
    setPrediction(null);

    try {
      const { prediction, matchAnalysis: analysis } = await getSinglePrediction();
      setPrediction(prediction);

      if (prediction.type === 'single' && analysis) {
        const matchName = prediction.match;
        const selectedMatch = matches.find(m =>
          matchName.includes(m.homeTeam) || matchName.includes(m.awayTeam)
        );

        let realOdds = analysis.odds;
        if (selectedMatch?.odds) {
          const txt = analysis.prediction.toLowerCase();
          if (txt.includes('победа хозяев') || txt.includes('хозяева') || txt.includes('п1')) {
            realOdds = selectedMatch.odds.home;
          } else if (txt.includes('победа гостей') || txt.includes('гости') || txt.includes('п2')) {
            realOdds = selectedMatch.odds.away;
          } else if (txt.includes('ничья') || txt.includes('x')) {
            realOdds = selectedMatch.odds.draw;
          } else if (prediction.odds) {
            const list = [selectedMatch.odds.home, selectedMatch.odds.draw, selectedMatch.odds.away];
            if (list.some(odd => Math.abs(odd - prediction.odds!) < 0.1)) {
              realOdds = prediction.odds;
            }
          }
        }

        setMatchAnalysis({ ...analysis, odds: realOdds });
      }
    } catch (err: any) {
      // Если ошибка связана с лимитом прогнозов, показываем модальное окно
      if (err.response?.data?.error === 'PREDICTION_LIMIT_REACHED' ||
          err.response?.data?.error === 'PREMIUM_REQUIRED') {
        setShowSubscriptionModal(true);
      } else if (err.response?.data?.error === 'NO_PREDICTIONS') {
        setError(err.response?.data?.message || 'Прогнозы обновляются. Попробуйте через несколько минут.');
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Ошибка при получении прогноза',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExpress = async () => {
    if (!user?.premium) {
      setShowSubscriptionModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setExpressAnalysis(null);
    setMatchAnalysis(null);
    setPrediction(null);

    try {
      // Передаем все матчи в OpenAI для анализа и выбора 3 игр с минимальным риском
      const prediction = await getExpressPrediction();
      setPrediction(prediction);
      
      if (prediction.type === 'express') {
        // Преобразуем результаты в формат экспресс-прогноза
        const bets: ExpressBet[] = prediction.bets.map(bet => ({
          match: bet.match,
          prediction: bet.prediction,
          riskPercent: 25, // Базовый риск для экспресса, так как мы убрали процент риска
        }));
        
        // Рассчитываем общий процент риска для экспресса
        // Используем базовую оценку 30-35% для экспресса с низкими коэффициентами
        const totalRisk = 30; // Фиксированный риск для экспресса
        setExpressAnalysis({ bets, totalRisk });
      }
    } catch (err: any) {
      if (err.response?.data?.error === 'PREMIUM_REQUIRED') {
        setShowSubscriptionModal(true);
      } else if (err.response?.data?.error === 'NO_PREDICTIONS') {
        setError(err.response?.data?.message || 'Прогнозы обновляются. Попробуйте через несколько минут.');
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Ошибка при получении экспресс-прогноза',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExpress5 = async () => {
    if (!user?.premium) {
      setShowSubscriptionModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setExpressAnalysis(null);
    setMatchAnalysis(null);
    setPrediction(null);

    try {
      // Передаем все матчи в OpenAI для анализа и выбора 5 игр с минимальным риском
      const prediction = await getExpress5Prediction();
      setPrediction(prediction);
      
      if (prediction.type === 'express5') {
        // Преобразуем результаты в формат экспресс-прогноза
        const bets: ExpressBet[] = prediction.bets.map(bet => ({
          match: bet.match,
          prediction: bet.prediction,
          riskPercent: 25, // Базовый риск для экспресса
        }));
        
        // Для экспресса x5 риск выше
        const totalRisk = 35; // Фиксированный риск для экспресса x5
        setExpressAnalysis({ bets, totalRisk });
      }
    } catch (err: any) {
      if (err.response?.data?.error === 'PREMIUM_REQUIRED') {
        setShowSubscriptionModal(true);
      } else if (err.response?.data?.error === 'NO_PREDICTIONS') {
        setError(err.response?.data?.message || 'Прогнозы обновляются. Попробуйте через несколько минут.');
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Ошибка при получении экспресс-прогноза x5',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: 'week' | 'month' | 'threeMonths') => {
    try {
      setLoading(true);
      const payment = await createPayment(plan);
      
      // Перенаправляем на страницу оплаты Cryptomus
      window.location.href = payment.paymentUrl;
    } catch (error: any) {
      console.error('Ошибка при создании платежа:', error);
      alert(error.response?.data?.message || 'Ошибка при создании платежа. Попробуйте позже.');
      setLoading(false);
      setShowSubscriptionModal(false);
    }
  };

  if (authLoading) {
    return (
      <div className="app">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onSuccess={handleAuthSuccess} onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSuccess={handleAuthSuccess} onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  // Если админ и выбран другой экран, показываем его
  if (user.role === 'admin' && adminView !== 'main') {
    return (
      <div className="app">
        <div className="container">
          <header className="header">
            <div className="header-top">
              <div>
                <h1 className="title">AI Sports Analytics</h1>
                <p className="subtitle">Панель администратора</p>
              </div>
              <div className="user-info">
                <AdminMenu currentView={adminView} onViewChange={setAdminView} />
                <span className="user-name">{user.username}</span>
                {user.premium && <span className="premium-badge">PREMIUM</span>}
                <button onClick={handleLogout} className="logout-button">Выйти</button>
              </div>
            </div>
          </header>
          {adminView === 'urls' && <UrlManagement />}
          {adminView === 'users' && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#ccc' }}>
              <h2>Управление пользователями</h2>
              <p>Функционал в разработке</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-top">
            <div>
              <h1 className="title">AI Sports Analytics</h1>
              <p className="subtitle">Анализ актуальных спортивных матчей</p>
            </div>
            <div className="user-info">
              {user.role === 'admin' && (
                <AdminMenu currentView={adminView} onViewChange={setAdminView} />
              )}
              <span className="user-name">{user.username}</span>
              {user.premium && <span className="premium-badge">PREMIUM</span>}
              <button onClick={handleLogout} className="logout-button">Выйти</button>
            </div>
          </div>
        </header>

        {stats && (
          <StatsBar
            activeUsers={stats.activeUsers}
            successfulPredictions={stats.successfulPredictions}
            failedPredictions={stats.failedPredictions}
          />
        )}

        <div className="button-container">
          <button
            className="button button-primary"
            onClick={handleSingle}
            disabled={loading || matchesLoading}>
            Минимальный риск
            <span className="button-risk-badge">7%</span>
          </button>

          <button
            className="button button-secondary"
            onClick={handleExpress}
            disabled={loading || matchesLoading}>
            Экспресс x3
            <span className="button-risk-badge">14%</span>
          </button>

          <button
            className="button button-tertiary"
            onClick={handleExpress5}
            disabled={loading || matchesLoading}>
            Экспресс x5
            <span className="button-risk-badge">37%</span>
          </button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {matchAnalysis && <MatchAnalysisCard analysis={matchAnalysis} />}
        {expressAnalysis && (
          <ExpressAnalysisCard 
            bets={expressAnalysis.bets} 
            totalRisk={expressAnalysis.totalRisk}
            type={prediction?.type === 'express5' ? 'express5' : 'express'}
          />
        )}
        
        {matchesLoading ? (
          <LoadingSpinner />
        ) : (
          <MatchesList matches={matches} />
        )}

        {showSubscriptionModal && (
          <SubscriptionModal
            onClose={() => setShowSubscriptionModal(false)}
            onSelectPlan={handleSelectPlan}
          />
        )}
      </div>
    </div>
  );
};

export default App;
