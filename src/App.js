import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import SendMessage from './pages/SendMessage';
import CreateTemplate from './pages/CreateTemplate';
import ListTemplates from './pages/ListTemplates';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--black)',
            color: 'var(--white)',
            borderRadius: 'var(--border-radius-sm)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          },
        }}
      />
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