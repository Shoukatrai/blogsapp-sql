import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as BrouserRouter } from 'react-router-dom' 
createRoot(document.getElementById('root')).render(
  <BrouserRouter>
    <App />
  </BrouserRouter>,
)
