import React, { useState } from 'react';
import { login } from '../services/auth';
import './Login.css';

interface Props {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const Login: React.FC<Props> = ({ onSuccess, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Ошибка при входе'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Вход</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="username">Никнейм</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <div className="auth-switch">
          Нет аккаунта?{' '}
          <button type="button" onClick={onSwitchToRegister} className="auth-link">
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

