import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global API object for the CalcPlayground
window.calcPlaygroundAPI = {
  addBlocks: () => console.log("CalcPlayground not initialized yet"),
  setActiveColor: () => console.log("CalcPlayground not initialized yet"),
  reset: () => console.log("CalcPlayground not initialized yet"),
  calculate: () => console.log("Calculator not initialized yet")
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 