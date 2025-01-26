import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // or './App.jsx' if your file uses a .jsx extension
import './index.css'; // Ensure this imports your CSS if you have any

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);