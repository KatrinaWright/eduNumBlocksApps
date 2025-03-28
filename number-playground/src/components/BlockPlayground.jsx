import React, { useRef, useEffect, useState } from 'react';
import '../styles/BlockPlayground.css'


const BlockPlayground = ({ blockCount, activeColor }) => {
  const playgroundRef = useRef(null);
  const [blocks, setBlocks] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [magneticConnections, setMagneticConnections] = useState([]);

  // Create new blocks when blockCount or activeColor changes
  useEffect(() => {
    if (blockCount > 0) {
      const newBlocks = [];
      for (let i = 0; i < blockCount; i++) {
        newBlocks.push({
          id: `block-${Date.now()}-${i}`,
          x: 50 + (Math.random() * 100),
          y: 100 + (Math.random() * 100),
          width: 50,
          height: 50,
          color: activeColor,
          isConnected: false
        });
      }
      setBlocks(prev => [...prev, ...newBlocks]);
    }
  }, [blockCount, activeColor]);

  // Physics simulation with requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    let lastTime = 0;

    const magneticAttractionDistance = 20; // Distance at which blocks start attracting
    const snapDistance = 5; // Distance at which blocks will snap together

    const applyPhysics = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Skip physics if time delta is too large (tab was inactive)
      if (deltaTime > 100) {
        animationFrameId = requestAnimationFrame(applyPhysics);
        return;
      }

      // Apply physics to blocks
      const updatedBlocks = [...blocks];
      const newConnections = [];

      // Apply gravity and boundaries
      updatedBlocks.forEach((block) => {
        // Skip if this block is being dragged
        if (draggedBlock?.id === block.id) return;

        // Apply very light gravity (just a subtle effect)
        block.y += 0.2 * (deltaTime / 16);

        // Keep blocks within boundaries
        const playground = playgroundRef.current.getBoundingClientRect();
        if (block.x < 0) block.x = 0;
        if (block.y < 0) block.y = 0;
        if (block.x + block.width > playground.width) {
          block.x = playground.width - block.width;
        }
        if (block.y + block.height > playground.height) {
          block.y = playground.height - block.height;
        }
      });

      // Check for magnetic attraction between blocks
      for (let i = 0; i < updatedBlocks.length; i++) {
        for (let j = i + 1; j < updatedBlocks.length; j++) {
          const blockA = updatedBlocks[i];
          const blockB = updatedBlocks[j];

          // Skip if one of these blocks is being dragged
          if (draggedBlock?.id === blockA.id || draggedBlock?.id === blockB.id) continue;

          // Calculate potential connection points (sides of blocks)
          const connectionPoints = [
            // Right edge of A to left edge of B
            {
              distance: Math.abs((blockA.x + blockA.width) - blockB.x) + 
                         Math.abs((blockA.y + blockA.height/2) - (blockB.y + blockB.height/2)),
              pointA: { x: blockA.x + blockA.width, y: blockA.y + blockA.height/2 },
              pointB: { x: blockB.x, y: blockB.y + blockB.height/2 },
              snap: () => {
                blockB.x = blockA.x + blockA.width;
                blockB.y = blockA.y;
              }
            },
            // Bottom edge of A to top edge of B
            {
              distance: Math.abs((blockA.x + blockA.width/2) - (blockB.x + blockB.width/2)) + 
                         Math.abs((blockA.y + blockA.height) - blockB.y),
              pointA: { x: blockA.x + blockA.width/2, y: blockA.y + blockA.height },
              pointB: { x: blockB.x + blockB.width/2, y: blockB.y },
              snap: () => {
                blockB.x = blockA.x;
                blockB.y = blockA.y + blockA.height;
              }
            }
            // Add more connection points as needed
          ];

          // Find the closest connection point
          const closestConnection = connectionPoints.reduce(
            (closest, current) => current.distance < closest.distance ? current : closest,
            { distance: Number.MAX_VALUE }
          );

          // Apply magnetic attraction if blocks are close
          if (closestConnection.distance < magneticAttractionDistance) {
            // Add this connection to our list for visualization
            newConnections.push({
              id: `${blockA.id}-${blockB.id}`,
              pointA: closestConnection.pointA,
              pointB: closestConnection.pointB,
              strength: 1 - (closestConnection.distance / magneticAttractionDistance)
            });

            // If blocks are very close, snap them together
            if (closestConnection.distance < snapDistance && !blockA.isConnected && !blockB.isConnected) {
              closestConnection.snap();
              blockA.isConnected = true;
              blockB.isConnected = true;
            } else {
              // Otherwise apply a subtle attraction force
              const forceStrength = 0.5 * (deltaTime / 16);
              const directionX = closestConnection.pointB.x - closestConnection.pointA.x;
              const directionY = closestConnection.pointB.y - closestConnection.pointA.y;
              const distance = Math.sqrt(directionX * directionX + directionY * directionY);
              
              if (distance > 0) {
                const moveX = (directionX / distance) * forceStrength;
                const moveY = (directionY / distance) * forceStrength;
                
                blockB.x -= moveX;
                blockB.y -= moveY;
                blockA.x += moveX;
                blockA.y += moveY;
              }
            }
          }
        }
      }

      setBlocks(updatedBlocks);
      setMagneticConnections(newConnections);
      animationFrameId = requestAnimationFrame(applyPhysics);
    };

    animationFrameId = requestAnimationFrame(applyPhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [blocks, draggedBlock]);

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e, block) => {
    const playground = playgroundRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    setIsDragging(true);
    setDraggedBlock(block);
    setOffset({
      x: clientX - (playground.left + block.x),
      y: clientY - (playground.top + block.y)
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !draggedBlock) return;
    
    const playground = playgroundRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    const newX = clientX - playground.left - offset.x;
    const newY = clientY - playground.top - offset.y;
    
    setBlocks(blocks.map(block => {
      if (block.id === draggedBlock.id) {
        return { ...block, x: newX, y: newY, isConnected: false };
      }
      return block;
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedBlock(null);
  };

  // Add event listeners
  useEffect(() => {
    const playground = playgroundRef.current;
    
    const handleMouseMoveDoc = (e) => {
      if (isDragging) handleMouseMove(e);
    };
    
    const handleMouseUpDoc = () => {
      if (isDragging) handleMouseUp();
    };
    
    document.addEventListener('mousemove', handleMouseMoveDoc);
    document.addEventListener('mouseup', handleMouseUpDoc);
    document.addEventListener('touchmove', handleMouseMoveDoc);
    document.addEventListener('touchend', handleMouseUpDoc);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveDoc);
      document.removeEventListener('mouseup', handleMouseUpDoc);
      document.removeEventListener('touchmove', handleMouseMoveDoc);
      document.removeEventListener('touchend', handleMouseUpDoc);
    };
  }, [isDragging]);

  return (
    <div className="playground-container">
      <div className="playground" ref={playgroundRef}>
        {/* Connection lines between blocks */}
        <svg className="connections-layer">
          {magneticConnections.map((connection) => (
            <line
              key={connection.id}
              x1={connection.pointA.x}
              y1={connection.pointA.y}
              x2={connection.pointB.x}
              y2={connection.pointB.y}
              strokeDasharray="4,2"
              strokeWidth={2 * connection.strength}
              stroke="#FFC107"
            />
          ))}
        </svg>
        
        {/* Blocks */}
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`block ${isDragging && draggedBlock?.id === block.id ? 'dragging' : ''} ${block.isConnected ? 'connected' : ''}`}
            style={{
              left: `${block.x}px`,
              top: `${block.y}px`,
              width: `${block.width}px`,
              height: `${block.height}px`,
              backgroundColor: block.color,
              borderColor: adjustColorBrightness(block.color, -20)
            }}
            onMouseDown={(e) => handleMouseDown(e, block)}
            onTouchStart={(e) => handleMouseDown(e, block)}
          >
            {/* Connection points visualization */}
            {block.isConnected && (
              <>
                <div className="connection-point right" />
                <div className="connection-point bottom" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to adjust color brightness for border colors
function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const r = (num >> 16) + percent;
  const g = ((num >> 8) & 0x00FF) + percent;
  const b = (num & 0x0000FF) + percent;
  
  const newR = Math.clamp(r, 0, 255);
  const newG = Math.clamp(g, 0, 255);
  const newB = Math.clamp(b, 0, 255);
  
  return "#" + (newB | (newG << 8) | (newR << 16)).toString(16).padStart(6, '0');
}

// Add clamp method if not available
Math.clamp = Math.clamp || function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

export default BlockPlayground;