const fs = require('fs');
const path = require('path');

// Paths to the JSON files
const playgroundPath = path.join(__dirname, '../number-playground/public/numbers-data.json');
const blocksAppPath = path.join(__dirname, '../number-blocks-app/public/numbers-data.json');
const outputPath = path.join(__dirname, '../calc-playground/public/numbers-data.json');

// Read the JSON files
const playgroundData = JSON.parse(fs.readFileSync(playgroundPath, 'utf8'));
const blocksAppData = JSON.parse(fs.readFileSync(blocksAppPath, 'utf8'));

// Merge logic: Prioritize playgroundData, include unique from blocksAppData
const mergedData = { ...blocksAppData, ...playgroundData };

// Write the merged data to the new app's public folder
fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), 'utf8');

console.log('JSON data merged successfully into calc-playground/public/numbers-data.json'); 