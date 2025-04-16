import { useState, useEffect, useRef } from 'react';
import './App.css';

// Import our merged components
import Calculator from './components/Calculator';       /* Our merged components */
import BlocksArea from './components/BlocksArea';
import ControlPanel from './components/ControlPanel';

function App() {
  // State for JSON data
  const [numberData, setNumberData] = useState({});     /* State for JSON data */
  const [currentNumber, setCurrentNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for UI settings
  const [activeColor, setActiveColor] = useState('#FF5252');   /* State for UI settings */
  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );
  
  const blocksAreaRef = useRef();
  
  // Load the JSON data when the app starts
  useEffect(() => {                                /* Load the JSON data when the app starts */
    setLoading(true);
    fetch('/numbers-data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load number data');
        }
        return response.json();
      })
      .then(data => {
        setNumberData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  // Add event listener to detect orientation changes
  useEffect(() => {                                /* Add event listener to detect orientation changes */
    const handleResize = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set up the global API
  useEffect(() => {                                /* Set up the global API */
    if (!loading && !error) {
      window.calcPlaygroundAPI = {
        addBlocks: (count, color) => {
          if (blocksAreaRef.current && blocksAreaRef.current.addBlocks) {
            blocksAreaRef.current.addBlocks(count, color || activeColor);
          }
        },
        setActiveColor: (color) => {
          setActiveColor(color);
        },
        reset: () => {
          if (blocksAreaRef.current && blocksAreaRef.current.reset) {
            blocksAreaRef.current.reset();
          }
        },
        calculate: (expression) => {
          const result = eval(expression);         /* Simple evaluation for demo */
          setCurrentNumber(result.toString());
          return result;
        }
      };
    }
  }, [loading, error, activeColor]);

  // Handle result from calculator
  const handleCalculatorResult = (result) => {     /* Handle result from calculator */
    setCurrentNumber(result.toString());
  };

  // Handle adding blocks from control panel
  const handleAddBlocks = (count, color) => {      /* Handle adding blocks from control panel */
    if (color) {
      setActiveColor(color);
    }
    
    window.calcPlaygroundAPI.addBlocks(count, color);
  };

  // Handle color change from control panel
  const handleColorChange = (color) => {           /* Handle color change from control panel */
    setActiveColor(color);
    window.calcPlaygroundAPI.setActiveColor(color);
  };

  // Show loading state
  if (loading) {                                   /* Show loading state */
    return <div className="loading">Loading number data...</div>;
  }

  // Show error state
  if (error) {                                     /* Show error state */
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className={`app-container ${orientation}`}>
      <header className="app-header">
        <h1>Calc Playground</h1>
      </header>
      
      <main className="main-content">
        <div className="calculator-side">
          <Calculator onResultChange={handleCalculatorResult} />
          
          <div className="control-panel-container">
            <ControlPanel 
              onAddBlocks={handleAddBlocks} 
              onColorChange={handleColorChange}
            />
          </div>
        </div>
        
        <div className="blocks-side">
          {currentNumber && numberData[currentNumber] ? (
            <BlocksArea 
              ref={blocksAreaRef}
              number={currentNumber} 
              numberData={numberData}
              activeColor={activeColor}
            />
          ) : (
            <div className="blocks-placeholder">
              <p>Use the calculator to see number blocks!</p>
              {currentNumber && !numberData[currentNumber] && (
                <p>No data available for number {currentNumber}</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App; 