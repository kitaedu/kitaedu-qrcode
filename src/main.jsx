import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// styles are imported in App.jsx or here. I'll remove global import here since App.jsx handles it, or keep it consistent.
// In App.jsx I did import './styles/index.css';
// So no need to import here.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
