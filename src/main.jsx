import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>
);