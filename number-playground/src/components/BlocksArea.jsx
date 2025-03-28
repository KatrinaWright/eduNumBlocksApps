import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import '../styles/BlocksArea.css';

// Color mapping to actual CSS color values
const colorMap = {
  'light_orange': '#FFBE7D',
  'red': '#FF0000',
  'orange': '#FFA500',
  'yellow': '#FFFF00',
  'green': '#008000',
  'light_blue': '#ADD8E6',
  'indigo': '#4B0082',
  'violet': '#EE82EE',
  'pink': '#FFC0CB',
  'light_gray': '#D3D3D3',
  'mid_gray': '#A9A9A9',
  'dark_gray': '#696969',
  'light_yellow': '#FFFACD'
};

// The draggable block component
const Block = ({ id, color, position, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { id, color },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="block"
      style={{
        backgroundColor: colorMap[color] || color,
        opacity: isDragging ? 0.5 : 1,
        left: position.x,
        top: position.y
      }}
    />
  );
};

// The drop area for blocks
const BlocksContainer = ({ children, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'block',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const x = Math.round(delta.x);
      const y = Math.round(delta.y);
      
      onDrop(item.id, x, y);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop} 
      className={`blocks-container ${isOver ? 'highlight-drop-area' : ''}`}
    >
      {children}
    </div>
  );
};

// Club buttons for arranging blocks
const ClubButtons = ({ clubs, onArrange }) => {
  if (!clubs) return null;

  // Filter out false values and keep only the club names that are true
  const activeClubs = Object.entries(clubs)
    .filter(([_, isActive]) => isActive && typeof isActive === 'boolean')
    .map(([club]) => club);

  return (
    <div className="club-buttons">
      {activeClubs.map(club => (
        <button 
          key={club} 
          className="club-button"
          onClick={() => onArrange(club)}
        >
          {club.replace(/_/g, ' ')}
        </button>
      ))}
    </div>
  );
};

// Examples panel
const ExamplesPanel = ({ examples }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="examples-panel">
      <h3>Did you know?</h3>
      <ul>
        {examples.map((example, index) => (
          <li key={index}>{example}</li>
        ))}
      </ul>
    </div>
  );
};

// Main Blocks Area component
function BlocksArea({ number, numberData }) {
  const [blocks, setBlocks] = useState([]);
  
  // Generate blocks based on the number and JSON data
  useEffect(() => {
    if (!number || !numberData || !numberData[number]) {
      setBlocks([]);
      return;
    }
    
    const colorsData = numberData[number].colors;
    const newBlocks = [];
    let currentIndex = 0;
    
    // Create blocks for each color
    Object.entries(colorsData).forEach(([color, count]) => {
      for (let i = 0; i < count; i++) {
        // Arrange in a grid initially
        const column = currentIndex % 10;
        const row = Math.floor(currentIndex / 10);
        
        newBlocks.push({
          id: `${color}-${i}`,
          color,
          // Initial positions in a grid layout
          position: { 
            x: column * 35, 
            y: row * 35 
          }
        });
        
        currentIndex++;
      }
    });
    
    setBlocks(newBlocks);
  }, [number, numberData]);

  // Handle block movement
  const moveBlock = (id, xDelta, yDelta) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => {
        if (block.id === id) {
          return {
            ...block,
            position: {
              x: block.position.x + xDelta,
              y: block.position.y + yDelta
            }
          };
        }
        return block;
      })
    );
  };

  // Arrange blocks based on club pattern
  const arrangeBlocks = (pattern) => {
    const blockCount = blocks.length;
    let newPositions = [];

    switch (pattern) {
      case 'step_squad': {
        // Arrange in a triangle pattern
        let currentRow = 1;
        let currentY = 0;
        let blockIndex = 0;

        while (blockIndex < blockCount) {
          for (let i = 0; i < currentRow && blockIndex < blockCount; i++) {
            newPositions.push({
              x: i * 35,
              y: currentY
            });
            blockIndex++;
          }
          currentY += 35;
          currentRow++;
        }
        break;
      }
      case 'super_rectangle': {
        // Find factors to create a rectangle
        let bestWidth = Math.sqrt(blockCount);
        let bestHeight = Math.ceil(blockCount / bestWidth);

        // Try to find better factors
        for (let testWidth = Math.floor(bestWidth); testWidth >= 1; testWidth--) {
          if (blockCount % testWidth === 0) {
            bestWidth = testWidth;
            bestHeight = blockCount / testWidth;
            break;
          }
        }

        // Arrange in a rectangle
        for (let y = 0; y < bestHeight; y++) {
          for (let x = 0; x < bestWidth; x++) {
            const index = y * bestWidth + x;
            if (index < blockCount) {
              newPositions.push({
                x: x * 35,
                y: y * 35
              });
            }
          }
        }
        break;
      }
      default: {
        // Default grid arrangement
        const columns = 10;
        for (let i = 0; i < blockCount; i++) {
          const column = i % columns;
          const row = Math.floor(i / columns);
          
          newPositions.push({
            x: column * 35,
            y: row * 35
          });
        }
      }
    }

    // Update blocks with new positions
    setBlocks(prevBlocks => 
      prevBlocks.map((block, index) => ({
        ...block,
        position: index < newPositions.length ? newPositions[index] : block.position
      }))
    );
  };

  // Choose the appropriate backend based on device
  const dndBackend = isMobile ? TouchBackend : HTML5Backend;

  return (
    <div className="blocks-area">
      <DndProvider backend={dndBackend}>
        <BlocksContainer onDrop={moveBlock}>
          {blocks.map(block => (
            <Block
              key={block.id}
              id={block.id}
              color={block.color}
              position={block.position}
              onMove={moveBlock}
            />
          ))}
        </BlocksContainer>
      </DndProvider>

      {number && numberData[number] && (
        <>
          <ClubButtons 
            clubs={numberData[number].clubs} 
            onArrange={arrangeBlocks} 
          />
          <ExamplesPanel 
            examples={numberData[number].real_world_examples} 
          />
        </>
      )}
    </div>
  );
}

export default BlocksArea;