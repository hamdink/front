import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSectures } from '../../api/sectureService';

export const fetchSecteurs = createAsyncThunk('secteurs/fetchSecteurs', async () => {
  const response = await fetchSectures();
  return response;
});

const secteurSlice = createSlice({
  name: 'secteurs',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecteurs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSecteurs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSecteurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default secteurSlice.reducer;
