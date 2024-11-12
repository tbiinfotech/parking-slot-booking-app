import React, { useState } from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BankIcon from '../../assets/images/bank-icon.svg';
import StripeIcon from '../../assets/images/stripe-icon.svg'
import { useDispatch, useSelector } from 'react-redux';

const LinkBankAccount = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { token } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        console.log(`${import.meta.env.VITE_API_URL}/api/create-connected-account`)
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-connected-account`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            window.location.href = data.url; // Redirect to Stripe onboarding
        } catch (error) {
            console.error("Failed to connect:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
                maxWidth: 806,
                height: 446,
                m: 4,
                // mx: 'auto',
                borderRadius: 4,
                boxShadow: 3,
                bgcolor: 'background.paper',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        bgcolor: theme.palette.grey[200],
                        borderRadius: '50%',
                    }}
                >
                    <img src={BankIcon} />

                </Box>
                <Typography variant="h5" component="span" sx={{ mx: 1 }}>
                    •••
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        bgcolor: theme.palette.primary.light,
                        borderRadius: '50%',
                    }}
                >
                    <img src={StripeIcon} />
                </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
                Link Your Bank Account Securely via Stripe
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Link Your Bank To Receive Payments Securely Through Stripe. Your Information Is Encrypted, Ensuring Fast And Safe Transfers.
            </Typography>

            <Button
                onClick={handleConnect}
                variant="contained"
                color="#685FFF;
"
                sx={{
                    textTransform: 'none',
                    px: 5,
                    borderRadius: 2,
                    fontSize: isSmallScreen ? '0.875rem' : '1rem',
                    background: '#685FFF',
                    color: '#ffff',
                    width: '300px',
                    height: "56px"

                }}
            >
                {loading ? 'Connecting...' : 'stripe'}

            </Button>
        </Box>
    );
};

export default LinkBankAccount;
