import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { toast } from 'react-toastify';


export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const request = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ values, userId, token }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      if (values.hashTags) {
        values.hashTags.forEach((item, index) => {
          formData.append(`hashTags[${index}]`, item);
        });
      } else {
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            formData.append(key, values[key]);
          }
        }
      }

      const request = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/profile/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = request.data;
      if (!success) {
        toast.error(message || 'Something went Wrong!')
        return rejectWithValue(message || 'Something went Wrong!');
      }
      toast.success(message || 'Profile updated')
      // dispatch(fetchUser({ userId, token }))
      return values;
    } catch (error) {
      // console.log('error', error);
      toast.error(error.response?.data?.message || 'Something went Wrong!')
      return rejectWithValue(error.response?.data?.message || 'Something went Wrong!');
    }
  }
);


export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async ({ newPassword, token }, { rejectWithValue, dispatch }) => {
    try {

      const request = await axios.post(`${import.meta.env.VITE_API_URL}/api/reset-admin-password`, { newPassword, token }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { user,success, message } = request.data;
      if (!success) {
        toast.error(message || 'Something went Wrong!')
        return rejectWithValue(message || 'Something went Wrong!');
      }
      toast.success(message || 'Profile updated')
      // dispatch(fetchUser({ userId, token }))
      return user;
    } catch (error) {
      console.log('error', error);

      toast.error(error.response?.data?.error || 'Something went Wrong!')
      return rejectWithValue(error.response?.data?.error || 'Something went Wrong!');
    }
  }
);

const initialState = {
  loading: false,
  data: null,
  error: null,
  updateLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSuccess(state, action) {
      state.data = { ...state.data, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      }).addCase(updatePassword.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

  },
});

export const { } = userSlice.actions;
export default userSlice.reducer;