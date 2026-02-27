import React, { useState, useEffect } from 'react';
import { getVbetUrls, setVbetUrls } from '../services/admin';
import './UrlManagement.css';

export const UrlManagement: React.FC = () => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = async () => {
    try {
      setLoading(true);
      const loadedUrls = await getVbetUrls();
      setUrls(loadedUrls.length > 0 ? loadedUrls : ['']);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Ошибка при загрузке ссылок');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
    setSuccess(false);
  };

  const handleAddUrl = () => {
    setUrls([...urls, '']);
    setSuccess(false);
  };

  const handleRemoveUrl = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      setSuccess(false);
    }
  };

  const handleSave = async () => {
    // Фильтруем пустые URL
    const validUrls = urls.filter(url => url.trim() !== '');
    
    if (validUrls.length === 0) {
      setError('Должна быть хотя бы одна ссылка');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await setVbetUrls(validUrls);
      setUrls(validUrls);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Ошибка при сохранении ссылок');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="url-management">
        <div className="url-management-loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="url-management">
      <h2 className="url-management-title">Управление ссылками для парсинга</h2>
      
      {error && <div className="url-management-error">{error}</div>}
      {success && <div className="url-management-success">Ссылки успешно сохранены!</div>}

      <div className="url-management-list">
        {urls.map((url, index) => (
          <div key={index} className="url-management-item">
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="Введите URL для парсинга"
              className="url-management-input"
            />
            <button
              onClick={() => handleRemoveUrl(index)}
              className="url-management-remove"
              disabled={urls.length === 1}
              title="Удалить ссылку"
            >
              −
            </button>
          </div>
        ))}
      </div>

      <div className="url-management-actions">
        <button
          onClick={handleAddUrl}
          className="url-management-add"
          title="Добавить новую ссылку"
        >
          +
        </button>
        <button
          onClick={handleSave}
          className="url-management-save"
          disabled={saving}
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
};

