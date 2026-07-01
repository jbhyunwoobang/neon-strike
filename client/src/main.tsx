/**
 * main.tsx — React entrypoint. Mounts the app shell that hosts the WebGL
 * canvas and all screen overlays (menu, lobby, HUD, pause, game-over).
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
