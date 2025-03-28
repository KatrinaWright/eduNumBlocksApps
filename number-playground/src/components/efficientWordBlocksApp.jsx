
import React, { useState, useEffect, useMemo } from 'react';

const WordBlocksApp = () => {
  // Letter colors in a rainbow-inspired pattern
  const letterColors = {
    'A': '#FF0000', // Red
    'B': '#FF5500', // Red-Orange
    'C': '#FF9900', // Orange
    'D': '#FFCC00', // Yellow-Orange
    'E': '#FFFF00', // Yellow
    'F': '#CCFF00', // Yellow-Green
    'G': '#00FF00', // Green
    'H': '#00FFCC', // Blue-Green
    'I': '#00CCFF', // Light Blue
    'J': '#0088FF', // Blue
    'K': '#0000FF', // Deep Blue
    'L': '#8800FF', // Violet
    'M': '#CC00FF', // Purple
    'N': '#FF00FF', // Magenta
    'O': '#FF0088', // Pink
    'P': '#FF9999', // Light Red
    'Q': '#FFCC99', // Light Orange
    'R': '#FFFF99', // Light Yellow
    'S': '#CCFF99', // Light Green
    'T': '#99FFFF', // Light Cyan
    'U': '#99CCFF', // Light Blue
    'V': '#9999FF', // Light Purple
    'W': '#CC99FF', // Light Violet
    'X': '#FF99FF', // Light Pink
    'Y': '#CC6666', // Dusty Red
    'Z': '#66CC66'  // Dusty Green
  };
  
  // Simple dictionary of 3-5 letter words
  const dictionaryArray = [
    // 3 letter words
    'CAT', 'DOG', 'BAT', 'HAT', 'SIT', 'RUN', 'FUN', 'SUN', 'PEN', 'MAP',
    'CAN', 'CAR', 'BUS', 'BOX', 'FOX', 'FAR', 'JAR', 'JOB', 'LOG', 'MOP',
    'TOP', 'POT', 'PAN', 'PIN', 'BIN', 'WIN', 'TIN', 'TAP', 'NAP', 'SAP',
    // 4 letter words
    'CATS', 'DOGS', 'HATS', 'RUNS', 'FISH', 'SHIP', 'SHOP', 'STOP', 'STEP',
    'TRIP', 'TRAP', 'TRAM', 'FARM', 'FORM', 'FROM', 'FROG', 'BLOG', 'BLUE',
    'PINK', 'GRAY', 'PLAY', 'STAY', 'JUMP', 'LAMP', 'CARD', 'RAIN', 'SNOW',
    // 5 letter words
    'CLIMB', 'CRASH', 'FLASH', 'CRUSH', 'COAST', 'GHOST', 'HORSE', 'MOUSE',
    'HOUSE', 'CHASE', 'SHAPE', 'SHINE', 'SHARK', 'SHEEP', 'SLEEP', 'SPEAK',
    'SMART', 'SNACK', 'SMILE', 'SPELL', 'STARE', 'STORM', 'SWING', 'DREAM'
  ];
  
  // Optimized data structures - only computed once when component mounts
  const { validWords, prefixMap } = useMemo(() => {
    // Set for O(1) word lookups
    const validWords = new Set(dictionaryArray);
    
    // Prefix map for efficient prefix checking
    const prefixMap = {};
    
    // Build the prefix map
    dictionaryArray.forEach(word => {
      for (let i = 1; i <= word.length; i++) {
        const prefix = word.substring(0, i);
        if (!prefixMap[prefix]) {
          prefixMap[prefix] = [];
        }
        prefixMap[prefix].push(word);
      }
    });
    
    return { validWords, prefixMap };
  }, []);
  
  // Available letters for the player to use
  const availableLetters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z'
  ];
  
  // State for the current word
  const [currentWord, setCurrentWord] = useState('');
  
  // State for word validation status
  const [wordStatus, setWordStatus] = useState({
    isValid: false,
    message: 'Start building a word!',
    color: 'gray'
  });
  
  // Performance metrics for demonstration
  const [metrics, setMetrics] = useState({
    validationTime: 0,
    prefixCheckTime: 0
  });
  
  // Check if the current word is valid or if there are valid words with this prefix
  useEffect(() => {
    if (currentWord.length === 0) {
      setWordStatus({
        isValid: false,
        message: 'Start building a word!',
        color: 'gray'
      });
      return;
    }
    
    // Measure performance of validation (now O(1) with Set)
    const validationStart = performance.now();
    const isValidWord = validWords.has(currentWord);
    const validationEnd = performance.now();
    
    // If the current word is valid
    if (isValidWord) {
      setWordStatus({
        isValid: true,
        message: `✓ Valid word! ${currentWord.length < 5 ? '(Try adding more letters)' : ''}`,
        color: 'green'
      });
      
      setMetrics({
        validationTime: validationEnd - validationStart,
        prefixCheckTime: 0
      });
      
      return;
    }
    
    // Measure performance of prefix checking (now O(1) for lookup + filtering)
    const prefixStart = performance.now();
    // Get words that have this prefix (if any)
    const possibleWords = prefixMap[currentWord] || [];
    const prefixEnd = performance.now();
    
    if (possibleWords.length > 0) {
      setWordStatus({
        isValid: false,
        message: `Keep going! ${possibleWords.length} possible word${possibleWords.length === 1 ? '' : 's'} found.`,
        color: 'gray'
      });
    } else {
      setWordStatus({
        isValid: false,
        message: 'No valid words start with these letters.',
        color: 'red'
      });
    }
    
    setMetrics({
      validationTime: validationEnd - validationStart,
      prefixCheckTime: prefixEnd - prefixStart
    });
    
  }, [currentWord, validWords, prefixMap]);
  
  // Handle clicking on a letter
  const handleLetterClick = (letter) => {
    // Add the letter to the current word
    const newWord = currentWord + letter;
    
    // Limit to 5 letters max (can be adjusted)
    if (newWord.length <= 5) {
      setCurrentWord(newWord);
    }
  };
  
  // Clear the current word
  const handleClear = () => {
    setCurrentWord('');
  };
  
  // Provide a hint (show a valid word that starts with current letters)
  const handleHint = () => {
    if (currentWord.length === 0) {
      setWordStatus({
        isValid: false,
        message: 'Start with a letter first for a hint!',
        color: 'blue'
      });
      return;
    }
    
    const possibleWords = prefixMap[currentWord] || [];
    
    if (possibleWords.length > 0) {
      // Sort by length to prefer shorter words for hints
      const sortedWords = [...possibleWords].sort((a, b) => a.length - b.length);
      
      const hint = sortedWords[0];
      const nextLetter = hint[currentWord.length];
      
      setWordStatus({
        isValid: false,
        message: `Hint: Try adding "${nextLetter}" next`,
        color: 'blue'
      });
    } else {
      setWordStatus({
        isValid: false,
        message: 'No valid words start with these letters. Try clearing and starting over.',
        color: 'red'
      });
    }
  };
  
  // Demonstration function - add a batch of new words to the dictionary
  const handleAddWords = () => {
    // In a real app, you would add actual new words here
    const newWords = [
      'APPLE', 'BANANA', 'CHERRY', 'DRAGON', 'EAGLE',
      'FROG', 'GRAPE', 'HONEY', 'IGLOO', 'JACKET'
    ];
    
    // Here's how you would update the data structures
    // Note: In a real app, you'd need to rebuild the useMemo structures or use a ref
    const startTime = performance.now();
    
    // Update Set for O(1) lookups
    newWords.forEach(word => validWords.add(word));
    
    // Update prefix map
    newWords.forEach(word => {
      for (let i = 1; i <= word.length; i++) {
        const prefix = word.substring(0, i);
        if (!prefixMap[prefix]) {
          prefixMap[prefix] = [];
        }
        prefixMap[prefix].push(word);
      }
    });
    
    const endTime = performance.now();
    
    setWordStatus({
      isValid: false,
      message: `Added ${newWords.length} new words in ${(endTime - startTime).toFixed(2)}ms!`,
      color: 'blue'
    });
  };
  
  // Chunk an array into groups of specified size
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };
  
  // Split available letters into rows
  const letterRows = chunkArray(availableLetters, 9);
  
  // Get background color for word display based on status
  const getWordDisplayColor = () => {
    switch (wordStatus.color) {
      case 'green':
        return '#e6ffe6';
      case 'red':
        return '#ffe6e6';
      case 'blue':
        return '#e6e6ff';
      default:
        return '#f0f0f0';
    }
  };
  
  // Get border color for word display based on status
  const getWordDisplayBorder = () => {
    switch (wordStatus.color) {
      case 'green':
        return '#00aa00';
      case 'red':
        return '#aa0000';
      case 'blue':
        return '#0000aa';
      default:
        return '#aaaaaa';
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg">
      {/* App Header */}
      <div className="w-full bg-indigo-600 text-white text-center py-3 rounded-t-lg mb-4 relative">
        <h1 className="text-2xl font-bold">Word Blocks</h1>
        <div className="absolute right-4 top-3 bg-indigo-700 px-3 py-1 rounded-full text-sm">Letters</div>
      </div>
      
      {/* Word Display */}
      <div 
        className="w-full h-24 mb-2 flex items-center justify-center rounded-lg border-2 text-4xl font-bold"
        style={{ 
          backgroundColor: getWordDisplayColor(),
          borderColor: getWordDisplayBorder()
        }}
      >
        {currentWord || "_ _ _"}
      </div>
      
      {/* Word Status */}
      <div 
        className="w-full mb-6 py-2 text-center rounded-lg"
        style={{ color: wordStatus.color === 'gray' ? '#555555' : wordStatus.color }}
      >
        <p className="font-semibold">{wordStatus.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          Validation: {metrics.validationTime.toFixed(3)}ms | 
          Prefix check: {metrics.prefixCheckTime.toFixed(3)}ms | 
          Dictionary size: {validWords.size} words
        </p>
      </div>
      
      {/* Letter Blocks */}
      <div className="w-full mb-4 bg-white p-4 rounded-lg border border-gray-200">
        {letterRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center mb-2">
            {row.map((letter) => (
              <button
                key={letter}
                className="w-12 h-12 mx-1 rounded-lg text-white font-bold shadow hover:shadow-md transition-all"
                style={{ backgroundColor: letterColors[letter] }}
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
      
      {/* Control Buttons */}
      <div className="flex justify-between w-full">
        <button 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleClear}
        >
          Clear Word
        </button>
        
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleHint}
        >
          Hint
        </button>
        
        <button 
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddWords}
        >
          Add Words
        </button>
      </div>
      
      {/* Mode Switch Button */}
      <button 
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
      >
        Switch to Numbers
      </button>
      
      {/* Instructions */}
      <div className="mt-4 w-full bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="font-bold text-lg mb-2">How to Play Word Blocks:</h2>
        <ul className="list-disc pl-5">
          <li>Click on letter blocks to build a word (3-5 letters)</li>
          <li>Box turns <span className="text-green-600 font-semibold">green</span> for valid words</li>
          <li>Box turns <span className="text-gray-600 font-semibold">gray</span> if you're on your way to a valid word</li>
          <li>Box turns <span className="text-red-600 font-semibold">red</span> if no valid words can be formed</li>
          <li>Use the hint button if you get stuck!</li>
        </ul>
        
        <h3 className="font-bold text-md mt-3 mb-1">Technical Notes:</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          <li>Word validation is O(1) using a Set data structure</li>
          <li>Prefix checking is O(1) for lookup using a prefix map</li>
          <li>Adding new words is O(m) where m is the word length</li>
          <li>The app can efficiently handle thousands of words</li>
        </ul>
      </div>
    </div>
  );
};

export default WordBlocksApp;