import React, { useState } from 'react';
import '../styles/ControlPanel.css';

const ControlPanel = ({ onAddBlocks }) => {
  const [selectedColor, setSelectedColor] = useState('#FF5252');
  
  const colorOptions = [
    { id: 'red', color: '#FF5252' },
    { id: 'green', color: '#4CAF50' },
    { id: 'blue', color: '#2196F3' },
    { id: 'yellow', color: '#FFEB3B' },
    { id: 'purple', color: '#9C27B0' }
  ];
  
  const numberButtons = [
    { number: 1, color: '#FF0000' }, // Red
    { number: 2, color: '#FF8800' }, // Orange
    { number: 3, color: '#FFDD00', textColor: '#333333' }, // Yellow
    { number: 4, color: '#00CC00' }, // Green
    { number: 5, color: '#0088FF' }, // Blue
    { number: 6, color: '#4444FF' }, // Indigo
    { number: 7, color: '#9900FF' }, // Violet/Purple
    { number: 8, color: '#FF66CC' }, // Pink
    { number: 9, color: '#888888' }, // Grey
    { number: 10, color: 'white', borderColor: '#FF0000', textColor: '#FF0000' } // White with red border
  ];
  
  const handleAddBlocks = (count) => {
    onAddBlocks(count, selectedColor);
  };
  
  const handleColorChange = (color) => {
    setSelectedColor(color);
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
    </div>
  );
};

// Helper function to adjust color brightness for borders
function adjustColorBrightness(color, percent) {
  // Handle 'white' special case
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
