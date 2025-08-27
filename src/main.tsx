import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import rapid ranking optimization for quick SEO boost
import './utils/rapidRanking.ts';

// Import performance optimizations for speed boost
import './utils/performance.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
