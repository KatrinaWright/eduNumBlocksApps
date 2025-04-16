import { useState } from 'react';          /* React hook for state management */
import '../styles/Calculator.css';    /* Component-specific styles */

// Color mapping for numbers 0-9
const numberColors = {                /* Color mapping for numbers 0-9 */
  '0': '#FFFFFF',                     /* white */
  '1': '#FF0000',                     /* red */
  '2': '#FFA500',                     /* orange */
  '3': '#FFFF00',                     /* yellow */
  '4': '#008000',                     /* green */
  '5': '#ADD8E6',                     /* light blue */
  '6': '#4B0082',                     /* indigo */
  '7': '#EE82EE',                     /* violet */
  '8': '#FFC0CB',                     /* pink */
  '9': '#A9A9A9'                      /* dark gray */
};

function Calculator({ onResultChange }) {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const clearAll = () => {            /* Reset calculator to initial state */
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleDigit = (digit) => {    /* Handle numeric button clicks */
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimalPoint = () => {  /* Handle decimal point button click */
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (nextOperator) => {  /* Handle operation button clicks */
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (op, first, second) => {  /* Perform arithmetic operations */
    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '×':
        return first * second;
      case '÷':
        return first / second;
      default:
        return second;
    }
  };

  const handleEquals = () => {        /* Handle equals button click */
    if (!operator || firstOperand === null) return;

    const inputValue = parseFloat(display);
    const result = performCalculation(operator, firstOperand, inputValue);
    
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    
    onResultChange(Math.round(result));  /* Round to whole number for blocks */
    
    if (window.calcPlaygroundAPI) {      /* Update the global API with the result */
      window.calcPlaygroundAPI.calculate(result);
    }
  };

  return (
    <div className="calculator">
      <div className="calculator-display">{display}</div>
      <div className="calculator-keypad">
        <div className="function-keys">
          <button className="key-clear" onClick={clearAll}>C</button>
        </div>
        <div className="digit-keys">
          {/* Number buttons with color coding in correct calculator layout */}
          {/* Row 1: 7-8-9 */}
          <button
            className="key-digit"
            onClick={() => handleDigit('7')}
            style={{ 
              backgroundColor: numberColors['7'],
              color: '#000'
            }}
          >
            7
          </button>
          <button
            className="key-digit"
            onClick={() => handleDigit('8')}
            style={{ 
              backgroundColor: numberColors['8'],
              color: '#000'
            }}
          >
            8
          </button>
          <button
            className="key-digit"
            onClick={() => handleDigit('9')}
            style={{ 
              backgroundColor: numberColors['9'],
              color: '#fff'
            }}
          >
            9
          </button>
          
          {/* Row 2: 4-5-6 */}
          <button
            className="key-digit"
            onClick={() => handleDigit('4')}
            style={{ 
              backgroundColor: numberColors['4'],
              color: '#fff'
            }}
          >
            4
          </button>
          <button
            className="key-digit"
            onClick={() => handleDigit('5')}
            style={{ 
              backgroundColor: numberColors['5'],
              color: '#000'          /* Light blue gets black text */
            }}
          >
            5
          </button>
          <button
            className="key-digit"
            onClick={() => handleDigit('6')}
            style={{ 
              backgroundColor: numberColors['6'],
              color: '#fff'
            }}
          >
            6
          </button>
          
          {/* Row 3: 1-2-3 */}
          <button
            className="key-digit"
            onClick={() => handleDigit('1')}
            style={{ 
              backgroundColor: numberColors['1'],
              color: '#fff'
            }}
          >
            1
          </button>
          <button
            className="key-digit"
            onClick={() => handleDigit('2')}
            style={{ 
              backgroundColor: numberColors['2'],
              color: '#000'
            }}
          >
            2
          </button>
          <button
            className="key-digit"
            onClick={() => handleDigit('3')}
            style={{ 
              backgroundColor: numberColors['3'],
              color: '#000'
            }}
          >
            3
          </button>
          
          {/* Row 4: 0-. */}
          <button
            className="key-digit key-zero"
            onClick={() => handleDigit('0')}
            style={{ 
              backgroundColor: numberColors['0'],
              color: '#000'
            }}
          >
            0
          </button>
          <button 
            className="key-dot" 
            onClick={handleDecimalPoint}
          >
            .
          </button>
        </div>
        <div className="operator-keys">
          <button 
            className="key-operator" 
            onClick={() => handleOperation('+')}
          >
            +
          </button>
          <button 
            className="key-operator" 
            onClick={() => handleOperation('-')}
          >
            −
          </button>
          <button 
            className="key-operator" 
            onClick={() => handleOperation('×')}
          >
            ×
          </button>
          <button 
            className="key-operator" 
            onClick={() => handleOperation('÷')}
          >
            ÷
          </button>
          <button 
            className="key-equals" 
            onClick={handleEquals}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator; 