import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  TextField, Button, Container, Typography, Paper, Box, 
  InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Reuse the styled components
const styledTextField = {
  '& .MuiInputBase-root': {
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'var(--off-white)',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E0E0',
    },
    '&:hover fieldset': {
      borderColor: 'var(--purple)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--purple)',
      borderWidth: '1px',
    },
  },
};

const Settings = () => {
  const [credentials, setCredentials] = useState({ phoneNumberId: '', accessToken: '' });
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const { data } = await api.get('/credentials');
        if (data) {
          setCredentials({
            phoneNumberId: data.phoneNumberId || '',
            accessToken: data.accessToken ? '********' : '',
          });
        }
      } catch (err) {
        toast.error('Kaydedilmiş ayarlar yüklenemedi.');
        console.error('Failed to fetch credentials:', err);
      }
    };
    fetchCredentials();
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...credentials };
      if (dataToSend.accessToken === '********' || dataToSend.accessToken === '') {
        delete dataToSend.accessToken;
      }

      await api.post('/credentials', dataToSend);
      toast.success('Ayarlar başarıyla kaydedildi!');
      if(dataToSend.accessToken) {
        setCredentials(prev => ({...prev, accessToken: '********' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ayarlar kaydedilirken bir hata oluştu.');
      console.error('Failed to save credentials:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: 'var(--border-radius-lg)', background: 'var(--white)' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          API Ayarları
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          WhatsApp Business API bilgilerinizi buraya girin.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumberId"
            label="Telefon Numarası ID"
            name="phoneNumberId"
            value={credentials.phoneNumberId}
            onChange={handleChange}
            autoFocus
            sx={styledTextField}
          />
          <TextField
            margin="normal"
            fullWidth
            name="accessToken"
            label="Erişim Anahtarı (Access Token)"
            type={showToken ? 'text' : 'password'}
            id="accessToken"
            value={credentials.accessToken}
            onChange={handleChange}
            placeholder="Değiştirmek için yeni anahtarı girin"
            sx={styledTextField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle token visibility"
                    onClick={() => setShowToken(!showToken)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showToken ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ 
              mt: 3, 
              mb: 2,
              borderRadius: 'var(--border-radius-sm)', 
              color: 'var(--white)',
              background: 'var(--primary-gradient)',
              transition: 'opacity 0.3s',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            Ayarları Kaydet
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings; 