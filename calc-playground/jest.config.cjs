module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ["./src/setupTests.js"],
  transformIgnorePatterns: [
    "/node_modules/(?!react-dnd|dnd-core|@react-dnd)"
  ],
  testMatch: [
    "**/__tests__/**/*.jsx",
    "**/?(*.)+(spec|test).jsx"
  ]
}; 