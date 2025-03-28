import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Global API object for the BlockPlayground
window.blockPlaygroundAPI = {
  addBlocks: () => console.log("BlockPlayground not initialized yet"),
  setActiveColor: () => console.log("BlockPlayground not initialized yet"),
  reset: () => console.log("BlockPlayground not initialized yet"),
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
