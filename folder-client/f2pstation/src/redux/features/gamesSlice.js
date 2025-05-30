import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Swal from 'sweetalert2';

// URL backend lokal
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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Async thunk untuk fetch games dari backend lokal
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Mengambil data dari endpoint backend lokal
      const response = await axios.get(`${API_URL}/games`, { params });
      return response.data;
    } catch (error) {
      // Tampilkan SweetAlert untuk error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data games. Silakan coba lagi nanti.',
      });
      
      return rejectWithValue(error.message || 'Failed to fetch games');
    }
  }
);

// Async thunk untuk fetch favorites
export const fetchFavorites = createAsyncThunk(
  'games/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat daftar favorit. Silakan coba lagi nanti.',
      });
      
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

// Async thunk untuk add to favorites
export const addToFavorites = createAsyncThunk(
  'games/addToFavorites',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/favorites/${gameId}`);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Game berhasil ditambahkan ke favorit',
        timer: 1500,
        showConfirmButton: false
      });
      
      return { gameId, message: response.data.message };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Gagal menambahkan game ke favorit',
      });
      
      return rejectWithValue(error.response?.data?.message || 'Failed to add to favorites');
    }
  }
);

// Async thunk untuk remove from favorites
export const removeFromFavorites = createAsyncThunk(
  'games/removeFromFavorites',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/favorites/${gameId}`);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Game berhasil dihapus dari favorit',
        timer: 1500,
        showConfirmButton: false
      });
      
      return { gameId, message: response.data.message };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Gagal menghapus game dari favorit',
      });
      
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from favorites');
    }
  }
);

const initialState = {
  games: [],
  favorites: [],
  pagination: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  favoritesStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    // Reducer synchronous bisa ditambahkan di sini
    setGames: (state, action) => {
      state.games = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Menyesuaikan dengan struktur respons dari backend lokal
        state.games = action.payload.games || action.payload;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.favoritesStatus = 'loading';
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favoritesStatus = 'succeeded';
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.favoritesStatus = 'failed';
        state.error = action.payload;
      })
      // Add to favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        // Jika berhasil menambahkan ke favorit, kita perlu memperbarui daftar favorit
        // Ini akan dihandle oleh fetchFavorites yang dipanggil setelah addToFavorites berhasil
      })
      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        // Hapus game dari daftar favorit
        state.favorites = state.favorites.filter(game => game.id !== parseInt(action.payload.gameId));
      });
  },
});

export const { setGames } = gamesSlice.actions;
export default gamesSlice.reducer;