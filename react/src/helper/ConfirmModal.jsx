import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, IconButton, Modal } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCustomer, deleteListing, deleteAllListing } from '../../store/features/customersSlice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 371,
    bgcolor: 'background.paper',
    borderRadius: 4.25,
    // boxShadow: 24,
    p: 3.625,
    ':focus-visible': { outline: 'none' }
};

function ConfirmModal({ open, setOpen, type, onDeleteSelected, selectedUsers, setSelectedUsers }) {

    console.log('open', open)
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.auth);
    const { actionLoading } = useSelector(state => state.customers);
    const handleClose = () => setTimeout(() => !actionLoading && setOpen(null), 100);


    const handleConfirm = () => {

        console.log('type', type)
        if (type == 'deleteSpace') {
            console.log('deleteSpace open', open)
            dispatch(deleteListing({ listId: open, token }))
        } else if (type == 'user') {
            onDeleteSelected(selectedUsers);
            setSelectedUsers([]);
        } else if (type == 'deleteAllSpace') {
            dispatch(deleteAllListing({ listIds: selectedUsers, token }))
        } else {
            dispatch(deleteCustomer({ userId: open, token }))
        }
    };


    console.log('delete user open', open)
    useEffect(() => {
        if (!actionLoading) {
            setOpen(null)
        }
    }, [actionLoading])

    return (
        <>
            <Modal
                open={Boolean(open)}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableScrollLock
            >
                <Box sx={style} className='confirm-modal'>
                    <Box sx={{ position: 'relative' }}>
                        <IconButton sx={{
                            position: 'absolute', top: -30, right: -15, p: 0.564, bgcolor: '#d9d9d9', alignItems: 'center'
                        }} onClick={handleClose}>
                            <Close sx={{ fontSize: 12, fill: '#000' }} />
                        </IconButton>
                        <Box sx={{ fontSize: 20, fontFamily: 'Roboto', fontWeight: 600, textAlign: 'center', width: 245, margin: '18px auto' }}>
                            {type == 'list' ? `Are you sure you want to delete this List?` : 'Are you sure you want to delete this User?'}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 2.25 }} className='action-btn'>
                            <Button
                                className='cancel-btn'
                                sx={{
                                    width: 151, height: 38, border: '1px solid #DBE1E5', borderRadius: 2, bgcolor: '#fff', color: '#1E334A', fontSize: 14, fontFamily: 'Inter', fontWeight: 500, textTransform: 'none',
                                }}
                                onClick={handleClose}
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className='delete-btn'
                                sx={{
                                    width: 151, height: 38, bgcolor: '#3621A0', borderRadius: 2, color: '#fff', fontSize: 14, fontFamily: 'Inter', fontWeight: 500, textTransform: 'none',
                                }}
                                onClick={handleConfirm}
                                disabled={actionLoading}
                            >
                                {actionLoading ? <CircularProgress sx={{ color: '#fff' }} size={20} /> : 'Delete'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default ConfirmModal