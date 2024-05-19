import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { tokens, ColorModeContext } from './theme';
// import Header from "./components/Header";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Login failed. Please check your username and password.');
        }
    };

    return (
        
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor={colors.primary[400]}
            >

            <Box>
                <Box mb="30px">
            <Typography
                variant="h1"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
            >
                {"Welcome to Crime Analysis System"}
            </Typography>
            <Box display="flex" justifyContent="center" >
            <Typography variant="h5" color={colors.greenAccent[400]}>
                {"Crime Statistics of Islamabad City"}
            </Typography>
            </Box>
            </Box>
            </Box>


            <Box
                component="form"
                onSubmit={handleSubmit}
                p={4}
                bgcolor={colors.primary[800]}
                borderRadius="15px"
                boxShadow="3"
                width="400px"
                display="flex"
                flexDirection="column"
            >
                <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === 'dark' ? (
                            <DarkModeOutlinedIcon />
                        ) : (
                            <LightModeOutlinedIcon />
                        )}
                    </IconButton>
                </Box>
                <Typography variant="h4" color={colors.grey[100]} mb={2}>
                    Login
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ style: { color: colors.grey[300] } }}
                    InputProps={{ style: { color: colors.grey[100] } }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ style: { color: colors.grey[300] } }}
                    InputProps={{ style: { color: colors.grey[100] } }}
                />
                {error && (
                    <Typography color="error" mt={2}>
                        {error}
                    </Typography>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 3 }}
                >
                    Login
                </Button>
            </Box>
        </Box>
    );
}

export default Login;
