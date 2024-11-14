import React, { useState } from 'react';
import { Box, Button, Typography, Modal, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../../store/features/userSlice';
import { logoutSuccess } from '../../../store/features/authSlice';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { token } = useSelector(state => state.auth);
    const { name, email, phoneNumber } = useSelector(state => state.auth.loggedUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
        setModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        dispatch(updatePassword({ newPassword, token }));
        handleCloseModal();
        dispatch(logoutSuccess());
        navigate('/login');
    };

    return (
        <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, boxShadow: 3, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Profile</Typography>

            {/* Display-only fields */}
            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {email}
            </Typography>
            {/* <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Phone Number:</strong> {phoneNumber}
            </Typography> */}

            <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ mt: 2 }}>
                Change Password
            </Button>

            {/* Change Password Modal */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Change Password</Typography>
                        <IconButton onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {passwordError && (
                        <Typography color="error" sx={{ mt: 1 }}>{passwordError}</Typography>
                    )}

                    <TextField
                        fullWidth
                        type="password"
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mt: 2 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleChangePassword}
                        sx={{ mt: 3 }}
                    >
                        Update Password
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default UserProfile;
