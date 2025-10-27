import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app.jsx';
import './index.css';
// Usar variável de ambiente em vez de valor hardcoded

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log('🔧 Variáveis de ambiente:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID ? 'Configurado' : 'Não configurado',
  NODE_ENV: import.meta.env.MODE
});

if (!GOOGLE_CLIENT_ID) {
  console.error('Google Client ID não configurado');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);