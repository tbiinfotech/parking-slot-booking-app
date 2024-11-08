import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { toast } from 'react-toastify';


export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async ({ token }, { rejectWithValue }) => {
        try {
            const request = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { response, success, message } = request.data;
            if (!success) {
                toast.error(message || 'Something went Wrong!')
                return rejectWithValue(message || 'Something went Wrong!');
            }

            return response;  // Return data for fulfilled action
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went Wrong!')
            return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
        }
    }
);

export const fetchSpaceListing = createAsyncThunk(
    'customers/fetchSpaceListing',
    async ({ token }, { rejectWithValue }) => {
        try {
            const request = await axios.get(`${import.meta.env.VITE_API_URL}/api/addresses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { response, success, message } = request.data;
            if (!success) {
                toast.error(message || 'Something went Wrong!')
                return rejectWithValue(message || 'Something went Wrong!');
            }

            return response;  // Return data for fulfilled action
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went Wrong!')
            return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
        }
    }
);

export const fetchSpaceListingById = createAsyncThunk(
    'customers/fetchSpaceListingById',
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const request = await axios.get(`${import.meta.env.VITE_API_URL}/api/addresses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { response, success, message } = request.data;
            if (!success) {
                toast.error(message || 'Something went Wrong!')
                return rejectWithValue(message || 'Something went Wrong!');
            }

            return response;  // Return data for fulfilled action
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went Wrong!')
            return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    'customers/deleteCustomer',
    async ({ userId, token }, { rejectWithValue }) => {
        try {
            const request = await axios.delete(`${import.meta.env.VITE_API_URL}/api/delete-user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('request', request);


            const { success, message } = request.data;
            if (!success) {
                toast.error(message || 'Something went Wrong!')
                return rejectWithValue(message || 'Something went Wrong!');
            }
            toast.success(message || 'User deleted')

            return userId;  // Return data for fulfilled action
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went Wrong!')
            return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
        }
    }
);

const initialState = {
    loading: false,
    actionLoading: false,
    data: [],
    // spaceList:[],
    error: null,  // Add error field to store error messages
};


const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSpaceListing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSpaceListing.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSpaceListing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSpaceListingById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSpaceListingById.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSpaceListingById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteCustomer.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.data = state.data.filter(item => item._id !== action.payload);
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });
    },
});

export const { } = customersSlice.actions;
export default customersSlice.reducer;