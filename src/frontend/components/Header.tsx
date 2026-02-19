import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo" onClick={() => navigate('/')}>
          <span>✨ AI CV Generator</span>
        </div>

        {user && (
          <div className="user-menu">
            <div 
              className="user-avatar" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img src={user.picture} alt={user.name} />
              <span>{user.name}</span>
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => { navigate('/settings'); setShowDropdown(false); }}>
                  ⚙️ Settings
                </div>
                <div className="dropdown-item logout" onClick={logout}>
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
