import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const data = await authService.signup(userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const completeOnboarding = createAsyncThunk('auth/onboarding', async (onboardingData, { rejectWithValue }) => {
  try {
    const updatedUser = await authService.completeOnboarding(onboardingData);
    return updatedUser;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const checkAuthSession = createAsyncThunk('auth/checkSession', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.getCurrentUser();
    return user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialUser = storage.get('current_user') || null;
const initialToken = storage.get('auth_token') || (initialUser ? 'demo_token' : null);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken && !!initialUser,
    isLoading: false,
    error: null,
  },
  reducers: {
    setRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
        storage.set('current_user', state.user);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      authService.logout();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Complete Onboarding
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Check session
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      });
  },
});

export const { setRole, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
