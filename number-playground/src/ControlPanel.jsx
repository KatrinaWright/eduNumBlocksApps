import React, { useState } from 'react';
import './ControlPanel.css';

const ColorButton = ({ color, isActive, onClick }) => {
  return (
    <button
      className={`color-button ${isActive ? 'active' : ''}`}
      style={{ backgroundColor: color }}
      onClick={() => onClick(color)}
      aria-label={`Select ${color} color`}
    />
  );
};

const NumberButton = ({ number, onClick, colorClass }) => {
  const classNames = {
    1: 'red-button',
    2: 'orange-button',
    3: 'yellow-button',
    4: 'green-button',
    5: 'blue-button',
    6: 'indigo-button',
    7: 'violet-button',
    8: 'pink-button',
    9: 'gray-button',
    10: 'white-red-button'
  };

  return (
    <button
      className={`number-button ${classNames[number]}`}
      onClick={() => onClick(number)}
    >
      {number}
    </button>
  );
};

const ControlPanel = ({ onAddBlocks, onColorChange }) => {
  const [activeColor, setActiveColor] = useState('#FF5252');
  
  const colors = [
    '#FF5252', // Red
    '#FF9800', // Orange
    '#FFEB3B', // Yellow
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#3F51B5', // Indigo
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#795548', // Brown
    '#607D8B'  // Gray
  ];

  const handleColorClick = (color) => {
    setActiveColor(color);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const handleNumberClick = (number) => {
    if (onAddBlocks) {
      // Pass the currently active color to ensure it's used immediately
      onAddBlocks(number, activeColor);
    }
  };

  return (
    <div className="control-panel">
      <div className="color-picker">
        <label className="control-label">Block Color:</label>
        <div className="color-options">
          {colors.map((color, index) => (
            <ColorButton
              key={index}
              color={color}
              isActive={color === activeColor}
              onClick={handleColorClick}
            />
          ))}
        </div>
      </div>
      
      <div className="block-controls">
        <label className="control-label">Add Blocks:</label>
        <div className="number-buttons">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(number => (
            <NumberButton
              key={number}
              number={number}
              onClick={handleNumberClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;