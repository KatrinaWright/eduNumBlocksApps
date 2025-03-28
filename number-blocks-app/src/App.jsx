import { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import BlocksArea from './components/BlocksArea';
import './App.css';

function App() {
  const [numberData, setNumberData] = useState({});
  const [currentNumber, setCurrentNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );
  
  // Load the JSON data when the app starts
  useEffect(() => {
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
  useEffect(() => {
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

  // Handle result from calculator
  const handleCalculatorResult = (result) => {
    // Convert result to a number and use it
    setCurrentNumber(result.toString());
    
    // On small screens in portrait mode, auto-scroll to blocks area
    if (window.innerWidth < 768 && orientation === 'portrait') {
      setTimeout(() => {
        document.querySelector('.blocks-side')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  // Show loading state
  if (loading) {
    return <div className="loading">Loading number data...</div>;
  }

  // Show error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className={`app-container ${orientation}`}>
      <div className="calculator-side">
        <Calculator onResultChange={handleCalculatorResult} />
      </div>
      <div className="blocks-side">
        {currentNumber && numberData[currentNumber] ? (
          <BlocksArea 
            number={currentNumber} 
            numberData={numberData} 
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
    </div>
  );
}

export default App;