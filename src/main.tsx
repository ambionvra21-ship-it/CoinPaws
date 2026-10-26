import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Fatal Error: Failed to find target root mounting element container node inside layout.');
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('MoneyPaws framework engine initialized successfully.');
  } catch (error) {
    console.error('Safe mounting execution catch block caught error:', error);
  }
}
