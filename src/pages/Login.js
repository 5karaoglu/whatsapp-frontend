import React, { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import FacebookLogin from 'react-facebook-login';
import { Paper, Typography, Box, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Container } from '@mui/material';

const Login = () => {
    const { login } = useAuth();

    const responseFacebook = (response) => {
        console.log('Facebook Login Success!', response);
        if (response.accessToken) {
            login(response.accessToken);
        } else {
            console.error('Facebook login failed:', response);
        }
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
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    autoLoad={false}
                    fields="name,email,picture"
                    scope="email"
                    callback={responseFacebook}
                    icon="fa-facebook"
                />
            </Paper>
        </Box>
    );
};

export default Login; 