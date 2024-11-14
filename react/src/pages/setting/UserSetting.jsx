import React, { useState } from 'react';
import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const UserSetting = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { token } = useSelector(state => state.auth);

    // States for input fields and loading state
    const [stripePublicKey, setStripePublicKey] = useState('');
    const [stripeSecretKey, setStripeSecretKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle save button click
    const handleSave = async () => {
        if (!stripePublicKey || !stripeSecretKey) {
            setError('Both Stripe public and secret keys are required.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/save-stripe-keys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    publicKey: stripePublicKey,
                    secretKey: stripeSecretKey,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Handle successful saving, maybe show a success message
                console.log('Keys saved successfully');
                toast.success('Keys saved successfully')
                setStripePublicKey('')
                setStripeSecretKey('')
            } else {
                setError(data.message || 'An error occurred while saving the keys.');
            }
        } catch (error) {
            console.error('Failed to save Stripe keys:', error);
            setError('Failed to save Stripe keys.');
            toast.error('Failed to save Stripe keys')
        } finally {
            setLoading(false);
        }
    };

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
                borderRadius: 4,
                boxShadow: 3,
                bgcolor: 'background.paper',
            }}
        >
            <Typography variant="h5" sx={{ mb: 2 }}>Stripe API Keys</Typography>

            <TextField
                label="Stripe Public Key"
                variant="outlined"
                fullWidth
                value={stripePublicKey}
                onChange={(e) => setStripePublicKey(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TextField
                label="Stripe Secret Key"
                variant="outlined"
                fullWidth
                type="password"
                value={stripeSecretKey}
                onChange={(e) => setStripeSecretKey(e.target.value)}
                sx={{ mb: 2 }}
            />

            {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? 'Saving...' : 'Save Keys'}
            </Button>
        </Box>
    );
};

export default UserSetting;
