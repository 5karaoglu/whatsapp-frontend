import React from 'react';
import { useAuth } from '../context/AuthContext'; // Correctly import useAuth
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Container, Paper, Typography, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

const Login = () => {
    const { login } = useAuth(); // Use the custom hook

    const handleFacebookLoginSuccess = (response) => {
        console.log('Facebook Login Success!', response);
        if (response.accessToken) {
            // The login function in AuthContext expects the whole response object
            // to extract the accessToken. Let's pass the whole object.
            login(response);
        } else {
            console.error('Facebook login failed: No access token', response);
        }
    };

    const handleFacebookLoginFail = (error) => {
        console.error('Facebook Login Failed!', error);
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Login
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
                            sx={{ mt: 3, mb: 2, backgroundColor: '#1877F2', '&:hover': { backgroundColor: '#166eab' } }}
                        >
                            Login with Facebook
                        </Button>
                    )}
                />
            </Paper>
        </Container>
    );
};

export default Login; 