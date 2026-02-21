/// <reference types="vite-plugin-pwa/client" />
/**
 * @file index.tsx
 * @description React DOM entry point that mounts the application to the root HTML element.
 * @author Mishat
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Register the PWA service worker to enable auto-update polling
registerSW({ immediate: true });

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);