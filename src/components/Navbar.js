import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          WhatsApp Management
        </Typography>
        {user && (
          <>
            <Button color="inherit" component={Link} to="/">Send Message</Button>
            <Button color="inherit" component={Link} to="/create-template">Create Template</Button>
            <Button color="inherit" component={Link} to="/list-templates">List Templates</Button>
            <Button color="inherit" component={Link} to="/settings">Settings</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;