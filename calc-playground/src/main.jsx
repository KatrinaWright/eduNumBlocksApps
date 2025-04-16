import React from 'react'               /* React core library */
import ReactDOM from 'react-dom/client'  /* ReactDOM for rendering */
import App from './App.jsx'           /* Main App component */
import './index.css'                  /* Global styles */

// Global API object for the CalcPlayground
window.calcPlaygroundAPI = {          /* Global API object for the CalcPlayground */
  addBlocks: () => console.log("CalcPlayground not initialized yet"),
  setActiveColor: () => console.log("CalcPlayground not initialized yet"),
  reset: () => console.log("CalcPlayground not initialized yet"),
  calculate: () => console.log("Calculator not initialized yet")
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>                  /* Strict mode for development checks */
    <App />
  </React.StrictMode>,
) 