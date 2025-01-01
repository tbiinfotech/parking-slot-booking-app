import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { toast } from 'react-toastify';


// export const fetchCustomers1 = createAsyncThunk(
//     'customers/fetchCustomers',
//     async ({ token }, { rejectWithValue }) => {
//         try {
//             const request = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-user`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             const { response, success, message } = request.data;
//             if (!success) {
//                 toast.error(message || 'Something went Wrong!')
//                 return rejectWithValue(message || 'Something went Wrong!');
//             }

//             return response;  // Return data for fulfilled action
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Something went Wrong!')
//             return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
//         }
//     }
// );

export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async ({ token, page, limit, status }, { rejectWithValue }) => {
        try {
            let query = `/?page=${encodeURIComponent(page || 1)}&limit=${encodeURIComponent(limit || 10)}`
            if (status) {
                query += `&status=${encodeURIComponent(status)}`
            }
            const request = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-users${query}`, {
                headers: {
                    Authorization: `Bearer ${token} `,
                },
            });

            const { data, success, message } = request.data;

            if (!success) {
                toast.error(message || 'Something went Wrong!')
                return rejectWithValue(message || 'Something went Wrong!');
            }

            return data;  // Return data for fulfilled action
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went Wrong!')
            return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
        }
    }
);

export const deleteCustomers = createAsyncThunk(
    'customers/deleteCustomers',
    async ({ userIds, token, page, limit }, { dispatch, rejectWithValue }) => {
        try {
            let query = `/?page=${encodeURIComponent(page || 1)}&limit=${encodeURIComponent(limit || 10)}`
            if (status) {
                query += `&status=${encodeURIComponent(status)}`
            }
            // Make API call to delete selected users
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/delete-users${query}`, { userIds }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { data, success, message } = response.data;
            if (!success) {
                toast.error(message || 'Failed to delete users!');
                return rejectWithValue(message || 'Failed to delete users!');
            }
            toast.success('Selected users deleted successfully!');
            return userIds; // Return the IDs of deleted users for further use if needed
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete users!');
            return rejectWithValue(error.response?.data?.message || 'Failed to delete users!');
        }
    }
);




export const fetchTransaction = createAsyncThunk(
    'customers/fetchTransaction',
    async ({ token }, { rejectWithValue }) => {
        try {
            const request = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`, {
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
)

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

export const deleteListing = createAsyncThunk(
    'customers/deleteListing',
    async ({ listId, token }, { rejectWithValue }) => {
        try {
            const request = await axios.delete(`${import.meta.env.VITE_API_URL}/api/listings/${listId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('request', request);


            const { success, message } = request.data;
            if (!success) {
                toast.error(message || 'Something went Wrong1!')
                return rejectWithValue(message || 'Something went Wrong!');
            }
            toast.success(message || 'User deleted')

            return listId;  // Return data for fulfilled action
        } catch (error) {
            console.log('error', error)
            toast.error(error.response?.data?.message || 'Something went Wrong2!')
            return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
        }
    }
);

export const deleteAllListing = createAsyncThunk(
    'customers/deleteAllListing',
    async ({ listIds, token }, { rejectWithValue }) => {
        try {
            const request = await axios.post(`${import.meta.env.VITE_API_URL}/api/deleteListing`, { listIds }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('request', request);

            const { success, message } = request.data;
            if (!success) {
                toast.error(message || 'Something went Wrong1!')
                return rejectWithValue(message || 'Something went Wrong!');
            }
            toast.success(message || 'User deleted')

            return listIds;  // Return data for fulfilled action
        } catch (error) {
            console.log('error', error)
            toast.error(error.response?.data?.message || 'Something went Wrong2!')
            return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
        }
    }
);


export const fetchCustomersWithPagination = createAsyncThunk(
    'customers/fetchCustomersWithPagination',
    async ({ token, page, limit, status }, { rejectWithValue }) => {
        try {
            let query = `/?page=${encodeURIComponent(page || 1)}&limit=${encodeURIComponent(limit || 10)}`
            if (status) {
                query += `&status=${encodeURIComponent(status)}`
            }
            const request = await axios.get(`${import.meta.env.VITE_API_URL}/api/addresses-with-pagination${query}`, {
                headers: {
                    Authorization: `Bearer ${token} `,
                },
            });

            const { data, success, message } = request.data;

            console.log('fetchCustomersWithPagination data', data)
            if (!success) {
                toast.error(message || 'Something went Wrong!')
                return rejectWithValue(message || 'Something went Wrong!');
            }

            return data;  // Return data for fulfilled action
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went Wrong!')
            return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
        }
    }
);
export const searchCustomersWithPagination = createAsyncThunk(
    'customers/searchCustomersWithPagination',
    async ({ token, page, limit, search }, { rejectWithValue }) => {
        try {
            let query = `?page=${encodeURIComponent(page || 1)}&limit=${encodeURIComponent(limit || 10)}`
            if (search) {
                query += `&search=${encodeURIComponent(search)}`
            }
            const request = await axios.get(`${import.meta.env.VITE_API_URL}/api/search-users${query}`, {
                headers: {
                    Authorization: `Bearer ${token} `,
                },
            });

            const { data, success, message } = request.data;

            console.log('fetchCustomersWithPagination data', data)
            if (!success) {
                toast.error(message || 'Something went Wrong!')
                return rejectWithValue(message || 'Something went Wrong!');
            }

            return data;  // Return data for fulfilled action
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went Wrong!')
            return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
        }
    }
);


const initialState = {
    loading: false,
    actionLoading: false,
    data: null,
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
            .addCase(fetchTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
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
                console.log('state', state.data.records)
                state.actionLoading = false;
                state.data.records = state.data.records.filter(item => item._id !== action.payload);
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            }).addCase(deleteCustomers.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteCustomers.fulfilled, (state, action) => {
                state.actionLoading = false;
                console.log('state.data', state.data)
                const deletedIds = action.payload; // Array of deleted customer IDs
                state.data.records = state.data.records.filter(item => !deletedIds.includes(item._id)); // Remove items with matching IDs
            })
            .addCase(deleteCustomers.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteListing.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteListing.fulfilled, (state, action) => {
                console.log('state.data', state)
                console.log('action.payload', action.payload)
                state.actionLoading = false;
                state.data.records = state.data.records.filter(item => item._id !== action.payload);
            })
            .addCase(deleteListing.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteAllListing.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteAllListing.fulfilled, (state, action) => {
                state.actionLoading = false;
                console.log('state.data', state)
                console.log('action.payload', action.payload)
                const deletedIds = new Set(action.payload); // Convert to Set for O(1) lookups
                state.data.records = state.data.records.filter(item => !deletedIds.has(item._id));

            })
            .addCase(deleteAllListing.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCustomersWithPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomersWithPagination.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCustomersWithPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(searchCustomersWithPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCustomersWithPagination.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(searchCustomersWithPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { } = customersSlice.actions;
export default customersSlice.reducer;