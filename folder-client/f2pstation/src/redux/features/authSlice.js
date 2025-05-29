import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Swal from 'sweetalert2';

// URL backend - ganti dengan URL backend Anda yang sebenarnya
const API_URL = 'http://localhost:3000';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    // console.log('Token from localStorage:', token); // Tambahkan logging
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('Authorization header:', config.headers.Authorization); // Tambahkan logging
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Async thunk untuk login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/login', { email, password });
      
      // Tampilkan SweetAlert untuk login berhasil
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: 'Selamat datang kembali!',
        timer: 1500,
        showConfirmButton: false
      });
      
      // Simpan token ke localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      // Tampilkan SweetAlert untuk login gagal
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan saat login',
      });
      
      return rejectWithValue(error.response?.data?.message || 'Login gagal');
    }
  }
);

// Async thunk untuk register
export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/register', { username, email, password });
      
      // Tampilkan SweetAlert untuk registrasi berhasil
      Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: 'Silakan login dengan akun baru Anda',
        timer: 1500,
        showConfirmButton: false
      });
      
      return response.data;
    } catch (error) {
      // Tampilkan SweetAlert untuk registrasi gagal
      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan saat registrasi',
      });
      
      return rejectWithValue(error.response?.data?.message || 'Registrasi gagal');
    }
  }
);

// Async thunk untuk logout
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  
  // Tampilkan SweetAlert untuk logout berhasil
  Swal.fire({
    icon: 'success',
    title: 'Logout Berhasil',
    text: 'Anda telah keluar dari sistem',
    timer: 1500,
    showConfirmButton: false
  });
  
  return null;
});

// Async thunk untuk mendapatkan profil pengguna
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error detail:', error.response?.data);
      console.error('Status code:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Profil',
        text: error.response?.data?.message || 'Terjadi kesalahan saat memuat profil',
      });
      
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat profil');
    }
  }
);

// Async thunk untuk memperbarui profil pengguna
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ username, profilePicture }, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', { username, profilePicture });
      
      Swal.fire({
        icon: 'success',
        title: 'Profil Diperbarui!',
        text: 'Profil Anda berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false
      });
      
      return { message: response.data.message, username, profilePicture };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memperbarui Profil',
        text: error.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil',
      });
      
      return rejectWithValue(error.response?.data?.message || 'Gagal memperbarui profil');
    }
  }
);

// Async thunk untuk Google login
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (id_token, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/login/google', { id_token });
      
      // Tampilkan SweetAlert untuk login berhasil
      Swal.fire({
        icon: 'success',
        title: 'Login Google Berhasil!',
        text: 'Selamat datang!',
        timer: 1500,
        showConfirmButton: false
      });
      
      // Simpan token ke localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      // Tampilkan SweetAlert untuk login gagal
      Swal.fire({
        icon: 'error',
        title: 'Login Google Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan saat login dengan Google',
      });
      
      return rejectWithValue(error.response?.data?.message || 'Login Google gagal');
    }
  }
);

// Cek apakah user sudah login dari localStorage
const token = localStorage.getItem('access_token');
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login gagal';
      })
      // Google Login cases - TAMBAHKAN INI
      .addCase(googleLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login Google gagal';
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
        // Tidak login otomatis setelah register
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registrasi gagal';
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      })
      // Tambahkan case untuk getProfile
      .addCase(getProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Gagal memuat profil';
      })
      // Tambahkan case untuk updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.user) {
          state.user.username = action.payload.username;
          state.user.profilePicture = action.payload.profilePicture;
        }
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Gagal memperbarui profil';
      });
  },
});

export const { resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;