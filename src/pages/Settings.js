import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TextField, Button, Container, Typography, Paper, Box, Alert } from '@mui/material';

const Settings = () => {
  const [credentials, setCredentials] = useState({
    phoneNumberId: '',
    accessToken: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch existing credentials when the component mounts
    const fetchCredentials = async () => {
      try {
        const { data } = await api.get('/credentials');
        if (data) {
          setCredentials({
            phoneNumberId: data.phoneNumberId || '',
            accessToken: data.accessToken ? '********' : '', // Don't show the real token
          });
        }
      } catch (err) {
        console.error('Failed to fetch credentials:', err);
        setError('Could not load your saved credentials.');
      }
    };
    fetchCredentials();
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // Filter out the placeholder so we don't try to save it
      const dataToSend = { ...credentials };
      if (dataToSend.accessToken === '********') {
        delete dataToSend.accessToken;
      }

      await api.post('/credentials', dataToSend);
      setMessage('Credentials saved successfully!');
    } catch (err) {
      console.error('Failed to save credentials:', err);
      setError(err.response?.data?.message || 'An error occurred while saving.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          API Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Enter your WhatsApp Business API credentials here.
        </Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumberId"
            label="Phone Number ID"
            name="phoneNumberId"
            value={credentials.phoneNumberId}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="accessToken"
            label="Access Token"
            type="password"
            id="accessToken"
            value={credentials.accessToken}
            onChange={handleChange}
            placeholder="Enter new token to update"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save Credentials
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings; 