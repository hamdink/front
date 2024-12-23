import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import loadGoogleMapsScript from './utils/loadGoogleMaps/loadGoogleMaps'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

loadGoogleMapsScript(apiKey).then(() => {
  root.render(
    <Router>
      <App />
    </Router>
  );
}).catch((error) => {
  console.error('Failed to load Google Maps script:', error);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
