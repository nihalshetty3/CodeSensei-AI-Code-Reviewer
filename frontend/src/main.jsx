import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import AuthSuccess from "./components/AuthSuccess.jsx";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Your main dashboard layout page */}
        <Route path="/" element={<App />} />
        
        {/* The hidden endpoint that intercepts your GitHub login token */}
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)