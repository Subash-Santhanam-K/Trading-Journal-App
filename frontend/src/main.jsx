import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#151924',
              color: '#D1D4DC',
              border: '1px solid #2A2E39',
              borderRadius: '8px'
            },
            success: {
              iconTheme: {
                primary: '#00C087',
                secondary: '#151924',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF4A68',
                secondary: '#151924',
              },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
