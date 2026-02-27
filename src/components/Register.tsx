import React, { useState } from 'react';
import { register } from '../services/auth';
import './Register.css';

interface Props {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<Props> = ({ onSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptPrivacyPolicy) {
      setError('Необходимо принять политику конфиденциальности');
      return;
    }

    setLoading(true);

    try {
      await register(username, password, acceptPrivacyPolicy);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Ошибка при регистрации'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Регистрация</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="reg-username">Никнейм</label>
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Минимум 8 символов, заглавная буква, цифра, символ"
            />
            <small className="auth-hint">
              Требования: минимум 8 символов, заглавная буква, цифра, специальный символ
            </small>
          </div>
          <div className="auth-field">
            <label htmlFor="reg-password">Пароль</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Минимум 8 символов, заглавная буква, цифра, символ"
            />
            <small className="auth-hint">
              Требования: минимум 8 символов, заглавная буква, цифра, специальный символ
            </small>
          </div>
          <div className="auth-field">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={acceptPrivacyPolicy}
                onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
                disabled={loading}
              />
              <span>Я принимаю политику конфиденциальности</span>
            </label>
            <div className="auth-privacy-policy">
              <strong>Политика конфиденциальности:</strong>
              <ul>
                <li>Все прогнозы на спортивные события не являются 100% гарантированными</li>
                <li>Результаты прогнозов могут содержать ошибки</li>
                <li>Приложение не несет ответственности за результаты ставок</li>
                <li>Использование прогнозов осуществляется на ваш собственный риск</li>
              </ul>
            </div>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-button" disabled={loading || !acceptPrivacyPolicy}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <div className="auth-switch">
          Уже есть аккаунт?{' '}
          <button type="button" onClick={onSwitchToLogin} className="auth-link">
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

