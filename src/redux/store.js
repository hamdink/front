import { configureStore } from '@reduxjs/toolkit';
import magasinReducer from './reducers/magasinReducer';

const store = configureStore({
  reducer: {
    magasins: magasinReducer,
  },
});

export default store;
