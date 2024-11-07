import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { toast } from 'react-toastify';


export const login = createAsyncThunk(
    'auth/login',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/sign-in`, values);

            const { token, user, message } = response.data;
            if (user.role === 'user') {
                throw Error
            }
            // localStorage.setItem('token', token);
            toast.success(message || 'Log in successful')
            return { token, user };  // Return data for fulfilled action
        } catch (error) {
            toast.error(error.response?.data?.message || 'Log in failed')
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

const initialState = {
    isAuthenticated: false,
    loggedUser: null,
    token: null,
    loading: false,
    error: null,  // Add error field to store error messages
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutSuccess: (state) => {
            state.isAuthenticated = false;
            state.loggedUser = null;
            state.token = null;
            state.error = null;  // Clear error on logout
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;  // Clear error when login starts
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.loggedUser = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logoutSuccess } = authSlice.actions;
export default authSlice.reducer;