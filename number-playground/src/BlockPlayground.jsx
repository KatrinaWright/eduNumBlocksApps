import React, { useState, useEffect, useRef } from 'react';
import './BlockPlayground.css';

// A simple Block component for the individual blocks
const Block = ({ id, color, x, y, onDragStart, onDrag, onDragEnd, isConnecting }) => {
  const blockRef = useRef(null);
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Update position if external props change
  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);
  
  // Track drag state
  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent default behavior
    
    const rect = blockRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    onDragStart(id);
  };

  // Handle touch starts for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = blockRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setIsDragging(true);
    onDragStart(id);
  };

  // Handle mousemove for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        setPosition({ x: newX, y: newY });
        onDrag(id, newX, newY);
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && e.touches[0]) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;
        setPosition({ x: newX, y: newY });
        onDrag(id, newX, newY);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd(id, position.x, position.y);
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd(id, position.x, position.y);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset, onDrag, onDragEnd, id, position.x, position.y]);

  return (
    <div
      ref={blockRef}
      className={`block ${isDragging ? 'dragging' : ''} ${isConnecting ? 'connecting' : ''}`}
      style={{
        backgroundColor: color,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="magnetic-point top"></div>
      <div className="magnetic-point right"></div>
      <div className="magnetic-point bottom"></div>
      <div className="magnetic-point left"></div>
    </div>
  );
};

// Main BlockPlayground component
const BlockPlayground = () => {
  const playgroundRef = useRef(null);
  const [blocks, setBlocks] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [activeColor, setActiveColor] = useState('#FF5252');
  const [connectingBlock, setConnectingBlock] = useState(null);
  const [nearbyBlock, setNearbyBlock] = useState(null);
  
  // Add blocks to the playground with specific color
  const addBlocks = (count, color = activeColor) => {
    const newBlocks = [];
    const rect = playgroundRef.current.getBoundingClientRect();
    
    // Use the passed color or fall back to active color
    const blockColor = color || activeColor;
    
    for (let i = 0; i < count; i++) {
      // Calculate random position within the playground
      const x = Math.random() * (rect.width - 100) + 50;
      const y = Math.random() * (rect.height - 100) + 50;
      
      newBlocks.push({
        id: nextId + i,
        color: blockColor,
        x,
        y,
        connections: []
      });
    }
    
    setBlocks([...blocks, ...newBlocks]);
    setNextId(nextId + count);
  };
  
  // Update active color
  const updateColor = (color) => {
    setActiveColor(color);
  };
  
  // Handle block dragging
  const handleDragStart = (id) => {
    // Set connecting block to track magnetic connections
    setConnectingBlock(id);
  };
  
  const handleDrag = (id, x, y) => {
    // Update block position during drag
    const updatedBlocks = blocks.map(block => 
      block.id === id 
        ? { ...block, x, y } 
        : block
    );
    
    setBlocks(updatedBlocks);
    
    // Find potential connections
    findNearbyBlocks(id, x, y, updatedBlocks);
  };
  
  const handleDragEnd = (id, x, y) => {
    // Apply magnetic connections if a nearby block is found
    if (nearbyBlock) {
      snapTogether(id, nearbyBlock.id, nearbyBlock.side);
    }
    
    // Reset connecting states
    setConnectingBlock(null);
    setNearbyBlock(null);
  };
  
  // Find blocks that are near enough for magnetic connection
  const findNearbyBlocks = (id, x, y, currentBlocks) => {
    const currentBlock = currentBlocks.find(block => block.id === id);
    if (!currentBlock) return;
    
    const BLOCK_SIZE = 50;
    const THRESHOLD = 15;  // How close blocks need to be to snap
    
    let closestDist = THRESHOLD;
    let closestBlock = null;
    let connectionSide = null;
    
    // Check each block
    for (const block of currentBlocks) {
      // Skip the block being dragged
      if (block.id === id) continue;
      
      // Check right side of current block to left side of other block
      const rightToLeftDist = Math.abs((x + BLOCK_SIZE) - block.x);
      if (rightToLeftDist < closestDist && Math.abs(y - block.y) < THRESHOLD) {
        closestDist = rightToLeftDist;
        closestBlock = block;
        connectionSide = 'right';
      }
      
      // Check left side of current block to right side of other block
      const leftToRightDist = Math.abs(x - (block.x + BLOCK_SIZE));
      if (leftToRightDist < closestDist && Math.abs(y - block.y) < THRESHOLD) {
        closestDist = leftToRightDist;
        closestBlock = block;
        connectionSide = 'left';
      }
      
      // Check bottom of current block to top of other block
      const bottomToTopDist = Math.abs((y + BLOCK_SIZE) - block.y);
      if (bottomToTopDist < closestDist && Math.abs(x - block.x) < THRESHOLD) {
        closestDist = bottomToTopDist;
        closestBlock = block;
        connectionSide = 'bottom';
      }
      
      // Check top of current block to bottom of other block
      const topToBottomDist = Math.abs(y - (block.y + BLOCK_SIZE));
      if (topToBottomDist < closestDist && Math.abs(x - block.x) < THRESHOLD) {
        closestDist = topToBottomDist;
        closestBlock = block;
        connectionSide = 'top';
      }
    }
    
    setNearbyBlock(closestBlock ? {
      id: closestBlock.id,
      side: connectionSide
    } : null);
  };
  
  // Snap blocks together when connection is made
  const snapTogether = (sourceId, targetId, connectionSide) => {
    const sourceBlock = blocks.find(block => block.id === sourceId);
    const targetBlock = blocks.find(block => block.id === targetId);
    
    if (!sourceBlock || !targetBlock) return;
    
    let newX = sourceBlock.x;
    let newY = sourceBlock.y;
    
    // Calculate new position based on connection side
    switch (connectionSide) {
      case 'right':
        newX = targetBlock.x - 50; // Align right edge to left edge
        newY = targetBlock.y; // Same y position
        break;
      case 'left':
        newX = targetBlock.x + 50; // Align left edge to right edge
        newY = targetBlock.y; // Same y position
        break;
      case 'bottom':
        newX = targetBlock.x; // Same x position
        newY = targetBlock.y - 50; // Align bottom edge to top edge
        break;
      case 'top':
        newX = targetBlock.x; // Same x position
        newY = targetBlock.y + 50; // Align top edge to bottom edge
        break;
      default:
        break;
    }
    
    // Update block position
    setBlocks(blocks.map(block => 
      block.id === sourceId
        ? { ...block, x: newX, y: newY }
        : block
    ));
  };
  
  // Initialize and expose API for external access
  useEffect(() => {
    window.blockPlaygroundAPI = {
      // We're using parameters here to ensure latest state
      addBlocks: (count, color) => addBlocks(count, color),
      setActiveColor: (color) => updateColor(color),
      reset: () => setBlocks([])
    };
    
    return () => {
      // Cleanup API on unmount
      window.blockPlaygroundAPI = null;
    };
  }, [blocks, activeColor]); // Dependencies to ensure API uses latest state
  
  return (
    <div className="block-playground" ref={playgroundRef}>
      <div className="playground-grid"></div>
      {blocks.map(block => (
        <Block
          key={block.id}
          id={block.id}
          color={block.color}
          x={block.x}
          y={block.y}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          isConnecting={connectingBlock === block.id && nearbyBlock !== null}
        />
      ))}
    </div>
  );
};

export default BlockPlayground;