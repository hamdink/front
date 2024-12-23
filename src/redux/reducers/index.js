import { combineReducers } from 'redux';
import magasinReducer from './magasinReducer';

const rootReducer = combineReducers({
  magasin: magasinReducer,
  // Add other reducers here
});

export default rootReducer;
