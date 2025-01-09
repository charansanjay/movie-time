import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
//import StarRating from './components/StarRating/StarRating';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <StarRating /> */}
  </StrictMode>
);
