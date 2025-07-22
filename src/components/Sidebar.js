import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import './Sidebar.css'; 
import { FiMessageSquare, FiFileText, FiPlusSquare, FiSettings, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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
        <p className="nav-category">MESAJLAŞMA</p>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FiMessageSquare />
          <span>Mesaj Gönder</span>
        </NavLink>

        <p className="nav-category">ŞABLONLAR</p>
        <NavLink to="/list-templates" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FiFileText />
          <span>Şablonları Listele</span>
        </NavLink>
        <NavLink to="/create-template" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FiPlusSquare />
          <span>Yeni Şablon Oluştur</span>
        </NavLink>

        <p className="nav-category">HESAP</p>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FiSettings />
          <span>Ayarlar</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="theme-switcher" onClick={toggleTheme}>
          <FiSun className={`theme-icon ${theme === 'light' ? 'active' : ''}`} />
          <div className={`switch-handle ${theme === 'dark' ? 'dark' : ''}`}></div>
          <FiMoon className={`theme-icon ${theme === 'dark' ? 'active' : ''}`} />
        </div>
        <button onClick={handleLogout} className="logout-button">
          <FiLogOut />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 