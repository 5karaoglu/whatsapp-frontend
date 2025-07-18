import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import SendMessage from './pages/SendMessage';
import CreateTemplate from './pages/CreateTemplate';
import ListTemplates from './pages/ListTemplates';
import Settings from './pages/Settings';

function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <SendMessage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-template" 
          element={
            <ProtectedRoute>
              <CreateTemplate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/list-templates" 
          element={
            <ProtectedRoute>
              <ListTemplates />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App; 