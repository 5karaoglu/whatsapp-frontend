import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Container, Paper, Typography, Button, Alert, CircularProgress } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

const Login = () => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFacebookLoginSuccess = async (response) => {
        setError('');
        setLoading(true);
        if (response.accessToken) {
            try {
                // The login function will now handle redirection on success.
                await login(response);
            } catch (err) {
                const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Login failed. Please ensure you have linked a WhatsApp Business Account to your Facebook Business profile.';
                setError(errorMessage);
                setLoading(false);
            }
            // No need for finally block, as login handles redirection or error is set.
        } else {
            setError('Facebook login failed: No access token received.');
            setLoading(false);
        }
    };

    const handleFacebookLoginFail = (error) => {
        console.error('Facebook Login Failed!', error);
        setError('Facebook login failed. Please check your connection and try again.');
        setLoading(false);
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
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
                            sx={{ mt: 3, mb: 2, backgroundColor: '#1877F2', '&:hover': { backgroundColor: '#166eab' } }}
                        >
                            {loading ? 'Configuring Account...' : 'Login with Facebook'}
                        </Button>
                    )}
                />
            </Paper>
        </Container>
    );
};

export default Login; 