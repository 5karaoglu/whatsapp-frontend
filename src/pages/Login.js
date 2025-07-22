import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Container, Paper, Typography, Button, CircularProgress, Box } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleFacebookLoginSuccess = async (response) => {
        setLoading(true);
        if (response.accessToken) {
            try {
                await login(response);
            } catch (err) {
                const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Login failed. Please ensure you have linked a WhatsApp Business Account to your Facebook Business profile.';
                toast.error(errorMessage);
                setLoading(false);
            }
        } else {
            toast.error(t('login.fb_login_no_token'));
            setLoading(false);
        }
    };

    const handleFacebookLoginFail = (error) => {
        console.error('Facebook Login Failed!', error);
        toast.error(t('login.fb_login_fail_generic'));
        setLoading(false);
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'var(--primary-gradient)'
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper 
                    elevation={6} 
                    sx={{ 
                        p: 4, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        borderRadius: 'var(--border-radius-md)'
                    }}
                >
                    <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {t('login.welcome_to_artibo')}
                    </Typography>
                    <Typography component="p" sx={{ mb: 3, color: 'var(--text-secondary)' }}>
                        {t('login.login_to_account')}
                    </Typography>
                    <FacebookLogin
                        appId={process.env.REACT_APP_FACEBOOK_APP_ID || ''}
                        onSuccess={handleFacebookLoginSuccess}
                        onFail={handleFacebookLoginFail}
                        scope="email,business_management,whatsapp_business_management,whatsapp_business_messaging"
                        render={({ onClick, disabled }) => (
                            <Button
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FacebookIcon />}
                                onClick={onClick}
                                disabled={disabled || loading}
                                size="large"
                                fullWidth
                                sx={{ 
                                    mt: 1, 
                                    mb: 2, 
                                    backgroundColor: '#1877F2', 
                                    '&:hover': { backgroundColor: '#166eab' },
                                    borderRadius: 'var(--border-radius-sm)',
                                    textTransform: 'none',
                                    fontWeight: '600'
                                }}
                            >
                                {loading ? t('login.configuring_account') : t('login.login_with_facebook')}
                            </Button>
                        )}
                    />
                </Paper>
            </Container>
        </Box>
    );
};

export default Login; 