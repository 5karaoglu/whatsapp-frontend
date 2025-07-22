import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  TextField, Button, Container, Typography, Paper, Box, 
  InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Reuse the styled components
const styledTextField = {
  '& .MuiInputBase-root': {
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'var(--input-bg)',
    transition: 'background-color 0.3s',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--border-color)',
      transition: 'border-color 0.3s',
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
  const { t } = useTranslation();
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
        toast.error(t('settings.toast_load_error'));
        console.error('Failed to fetch credentials:', err);
      }
    };
    fetchCredentials();
  }, [t]);

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
      toast.success(t('settings.toast_save_success'));
      if(dataToSend.accessToken) {
        setCredentials(prev => ({...prev, accessToken: '********' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t('settings.toast_save_error'));
      console.error('Failed to save credentials:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: 'var(--border-radius-lg)', background: 'var(--bg-secondary)', transition: 'background-color 0.3s' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          {t('settings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('settings.subtitle')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumberId"
            label={t('settings.phone_number_id')}
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
            label={t('settings.access_token')}
            type={showToken ? 'text' : 'password'}
            id="accessToken"
            value={credentials.accessToken}
            onChange={handleChange}
            placeholder={t('settings.access_token_placeholder')}
            sx={styledTextField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={t('settings.toggle_visibility')}
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
            {t('settings.button')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings; 