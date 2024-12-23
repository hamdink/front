import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlans as fetchPlansAPI, addPlan as addPlanAPI, deletePlan as deletePlanAPI, modifyPlan as modifyPlanAPI } from '../../api/plansService';

export const fetchPlans = createAsyncThunk('plans/fetchPlans', async () => {
  const response = await fetchPlansAPI();
  return response;
});

export const addPlan = createAsyncThunk('plans/addPlan', async (plan) => {
  const response = await addPlanAPI(plan);
  return response;
});

export const deletePlan = createAsyncThunk('plans/deletePlan', async (id) => {
  await deletePlanAPI(id);
  return id;
});

export const modifyPlan = createAsyncThunk('plans/modifyPlan', async (plan) => {
  const response = await modifyPlanAPI(plan._id, plan);
  return response;
});

const planSlice = createSlice({
  name: 'plans',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(modifyPlan.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default planSlice.reducer;
