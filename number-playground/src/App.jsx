import React, { useState, useEffect } from 'react';
import BlockPlayground from './BlockPlayground';
import ControlPanel from './ControlPanel';
import './App.css';

function App() {
  const [activeColor, setActiveColor] = useState('#FF5252');
  const blockPlaygroundRef = React.useRef();

  // Handle adding blocks from control panel
  const handleAddBlocks = (count, color) => {
    // First update our local state
    if (color) {
      setActiveColor(color);
    }
    
    // Then add the blocks with the selected color directly
    if (window.blockPlaygroundAPI) {
      // Pass the color directly to the addBlocks function
      window.blockPlaygroundAPI.addBlocks(count, color);
    }
  };

  // Handle color change from control panel
  const handleColorChange = (color) => {
    setActiveColor(color);
    if (window.blockPlaygroundAPI) {
      window.blockPlaygroundAPI.setActiveColor(color);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Block Physics Playground</h1>
        <button className="settings-button" aria-label="Settings">
          <span></span>
          <span></span>
        </button>
      </header>
      
      <main className="app-main">
        <BlockPlayground ref={blockPlaygroundRef} />
      </main>
      
      <footer className="app-footer">
        <ControlPanel 
          onAddBlocks={handleAddBlocks} 
          onColorChange={handleColorChange}
        />
      </footer>
    </div>
  );
}

export default App;