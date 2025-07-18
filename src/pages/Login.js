import React from 'react';
import { useAuth } from '../context/AuthContext';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Paper, Typography, Box, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

const Login = () => {
    const { login } = useAuth();

    const handleFacebookLoginSuccess = (response) => {
        console.log('Facebook Login Success!', response);
        login(response); // Pass the whole response object to the context
    };

    const handleFacebookLoginFail = (error) => {
        console.error('Facebook Login Failed!', error);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '90vh',
            }}
        >
            <Paper elevation={5} sx={{ p: 4, textAlign: 'center', maxWidth: 450, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Please log in with your Facebook account to manage your WhatsApp templates and messages.
                </Typography>
                <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID || ''}
                    onSuccess={handleFacebookLoginSuccess}
                    onFail={handleFacebookLoginFail}
                    scope="email"
                    render={({ onClick, disabled }) => (
                        <Button
                            variant="contained"
                            startIcon={<FacebookIcon />}
                            onClick={onClick}
                            disabled={disabled}
                            size="large"
                            fullWidth
                            sx={{ backgroundColor: '#1877F2', '&:hover': { backgroundColor: '#166eab' } }}
                        >
                            Login with Facebook
                        </Button>
                    )}
                />
            </Paper>
        </Box>
    );
};

export default Login; 