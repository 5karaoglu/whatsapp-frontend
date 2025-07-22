import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './Sidebar.css'; 
import { FiMessageSquare, FiFileText, FiPlusSquare, FiSettings, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation(); // Initialize useTranslation

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Artibo</h1>
      </div>
      <nav className="sidebar-nav">
        <p className="nav-category">{t('sidebar.messaging')}</p>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FiMessageSquare />
          <span>{t('sidebar.sendMessage')}</span>
        </NavLink>

        <p className="nav-category">{t('sidebar.templates')}</p>
        <NavLink to="/list-templates" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FiFileText />
          <span>{t('sidebar.listTemplates')}</span>
        </NavLink>
        <NavLink to="/create-template" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FiPlusSquare />
          <span>{t('sidebar.createTemplate')}</span>
        </NavLink>

        <p className="nav-category">{t('sidebar.account')}</p>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FiSettings />
          <span>{t('sidebar.settings')}</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="language-switcher">
          <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
          <button onClick={() => changeLanguage('tr')} className={i18n.language === 'tr' ? 'active' : ''}>TR</button>
        </div>
        <div className="theme-switcher" onClick={toggleTheme}>
          <FiSun className={`theme-icon ${theme === 'light' ? 'active' : ''}`} />
          <div className={`switch-handle ${theme === 'dark' ? 'dark' : ''}`}></div>
          <FiMoon className={`theme-icon ${theme === 'dark' ? 'active' : ''}`} />
        </div>
        <button onClick={handleLogout} className="logout-button">
          <FiLogOut />
          <span>{t('sidebar.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 