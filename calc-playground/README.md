# Calc Playground

A combined calculator and number blocks playground app for children's education, designed primarily for Android tablets and touch devices.

## Features

- Interactive calculator with colorful number buttons
- Number blocks visualization for learning counting and basic math
- Drag and drop blocks for spatial organization
- Real-world examples for each number
- Mathematical "clubs" for understanding number properties (odd, even, prime, etc.)
- Custom block creation with different colors
- Responsive design optimized for tablets with special consideration for landscape orientation
- Offline functionality - works without internet access once downloaded
- Mobile-first design principles
- No data collection mechanisms - suitable for children's privacy

## Technology

- React 19
- Vite
- React DnD for drag and drop
- Jest for testing
- Vanilla CSS (no frameworks or preprocessors)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage report
npm run test:coverage
```

## Testing Requirements

- Minimum 75% test coverage for all components
- All tests must pass with every code change
- Jest is used as the testing framework
- Run coverage reports with `npm run test:coverage`

## Data Structure

The app uses a rich JSON data structure that includes:
- Color representation for each number
- Mathematical properties (odd, even, prime, square, etc.)
- Real-world examples for each number

## UI/UX Design Principles

- Bright, engaging colors appropriate for a child audience
- Large, easily touchable buttons to accommodate children's motor skills
- Minimal reading requirements with visual cues and simple instructions
- Adequate touch targets for children's touch accuracy
- Support for both touch interactions and mouse input

## Technical Constraints

- Total project size under 5MB to meet download requirements
- Optimized image assets to minimize file size
- Modular and well-commented CSS for maintainability
- Cross-browser compatibility for testing and debugging

## Git Workflow

- Create separate development branches for features, bug fixes, or enhancements
- Use descriptive, present-tense commit messages
- Follow branch naming conventions:
  - `feature/feature-name` for new features
  - `bugfix/issue-description` for bug fixes
  - `hotfix/issue-description` for critical fixes
  - `release/version` for release preparation

## Credits

This application is a merged version of number-playground and number-blocks-app, optimized for children's educational purposes. 