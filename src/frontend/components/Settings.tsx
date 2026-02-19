import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/user/settings', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.geminiApiKey) {
        setMaskedKey(data.geminiApiKey);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/user/settings/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ apiKey })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('API key saved successfully!');
        setApiKey('');
        await refreshUser();
        await fetchSettings();
      } else {
        setError(data.error || 'Failed to save API key');
      }
    } catch (err) {
      setError('Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <button onClick={() => navigate('/')} className="back-btn">← Back</button>
          <h1>Settings</h1>
        </div>

        <div className="profile-section">
          <img src={user?.picture} alt={user?.name} className="profile-pic" />
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="api-key-section">
          <h3>Gemini API Key</h3>
          <p className="section-description">
            Add your own Gemini API key for unlimited CV generations. Get one free at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
              Google AI Studio
            </a>
          </p>

          {maskedKey && (
            <div className="current-key">
              <span>Current key: {maskedKey}</span>
            </div>
          )}

          <form onSubmit={handleSaveApiKey} className="api-key-form">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="api-key-input"
            />
            <button type="submit" disabled={isLoading || !apiKey} className="save-btn">
              {isLoading ? 'Saving...' : 'Save API Key'}
            </button>
          </form>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="logout-section">
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
