import { useState } from 'react';
import '../styles/ControlPanel.css';

const ControlPanel = ({ onAddBlocks, onColorChange }) => {
  const [selectedColor, setSelectedColor] = useState('#FF5252');
  
  const colorOptions = [
    { id: 'red', color: '#FF0000' },
    { id: 'orange', color: '#FFA500' },
    { id: 'yellow', color: '#FFFF00', textColor: '#333333' },
    { id: 'green', color: '#008000' },
    { id: 'blue', color: '#ADD8E6', textColor: '#333333' },
    { id: 'indigo', color: '#4B0082' },
    { id: 'violet', color: '#EE82EE' }
  ];
  
  const numberButtons = [
    { number: 1, color: '#FF0000' }, // Red
    { number: 2, color: '#FFA500' }, // Orange
    { number: 3, color: '#FFFF00', textColor: '#333333' }, // Yellow
    { number: 4, color: '#008000' }, // Green
    { number: 5, color: '#ADD8E6', textColor: '#333333' }, // Light Blue
    { number: 10, color: '#FFCCCB', textColor: '#333333', borderColor: '#FF0000' } // Ten
  ];
  
  const handleAddBlocks = (count) => {
    onAddBlocks(count, selectedColor);
  };
  
  const handleColorChange = (color) => {
    setSelectedColor(color);
    onColorChange(color);
  };
  
  const handleReset = () => {
    if (window.calcPlaygroundAPI) {
      window.calcPlaygroundAPI.reset();
    }
  };
  
  return (
    <div className="control-panel">
      <div className="color-selector">
        <span className="control-label">Block Color:</span>
        <div className="color-options">
          {colorOptions.map((option) => (
            <div
              key={option.id}
              className={`color-option ${selectedColor === option.color ? 'selected' : ''}`}
              style={{ backgroundColor: option.color }}
              onClick={() => handleColorChange(option.color)}
            />
          ))}
        </div>
      </div>
      
      <div className="number-buttons">
        <span className="control-label">Add Blocks:</span>
        {numberButtons.map((button) => (
          <button
            key={button.number}
            className="number-button"
            style={{
              backgroundColor: button.color,
              color: button.textColor || 'white',
              borderColor: button.borderColor || adjustColorBrightness(button.color, -20)
            }}
            onClick={() => handleAddBlocks(button.number)}
          >
            {button.number}
          </button>
        ))}
      </div>
      
      <div className="action-buttons">
        <button 
          className="action-button reset" 
          onClick={handleReset}
        >
          Reset Blocks
        </button>
      </div>
    </div>
  );
};

// Helper function to adjust color brightness for borders
function adjustColorBrightness(color, percent) {
  // Handle special case
  if (color === 'white') return '#CCCCCC';
  
  const num = parseInt(color.replace("#", ""), 16);
  const r = (num >> 16) + percent;
  const g = ((num >> 8) & 0x00FF) + percent;
  const b = (num & 0x0000FF) + percent;
  
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const newR = clamp(r, 0, 255);
  const newG = clamp(g, 0, 255);
  const newB = clamp(b, 0, 255);
  
  return "#" + (newB | (newG << 8) | (newR << 16)).toString(16).padStart(6, '0');
}

export default ControlPanel; 