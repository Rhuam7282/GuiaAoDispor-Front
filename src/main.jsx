import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './index.css';
// Usar variável de ambiente em vez de valor hardcoded

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);