// src/main.tsx or App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Your main App component
import './index.css'; // Your global styles, including Tailwind
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from "./components/ui/toast-provider";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>,
);